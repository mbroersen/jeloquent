import HasManyThrough from './Model/Relation/HasManyThrough.js';
import HasMany from "./Model/Relation/HasMany.js";
import BelongsTo from "./Model/Relation/BelongTo.js";
import MorphOne from "./Model/Relation/MorphOne.js";
import HasOne from "./Model/Relation/HasOne.js";
import HasOneThrough from "./Model/Relation/HasOneThrough.js";
import MorphTo from "./Model/Field/MorphTo.js";

import Field from "./Model/Field.js";
import Relation from "./Model/Relation.js";
import ForeignKey from "./Model/Field/ForeignKey.js";
import Index from "./Table/Index";

class Model {

    constructor(fields) {
        this.setFields(this.addRelationFields(fields));
        this._tmpId = `_${++globalThis.Store.numberOfModelCreated}`;
        this.snakeCaseName = this.constructor.snakeCaseClassName();
    }

    static getInstance() {
        const original =  globalThis.Store.classInstances[this.className()] ?? (globalThis.Store.classInstances[this.className()] = new this())
        const fieldsClone = original.originalFields.reduce((obj, field) => {
            obj.push(Object.assign(Object.create(Object.getPrototypeOf(field)), field));
            return obj;
        } ,[])

        return Object.create(Object.getPrototypeOf(original)).setFields(fieldsClone);
    }

    static snakeCaseClassName() {
        return (this.name[0].toLowerCase() + this.name.slice(1).replace(/([A-Z])/g, '_$1').toLowerCase());
    }

    static kebabCaseClassName() {
        return (this.name[0].toLowerCase() + this.name.slice(1).replace(/([A-Z])/g, '-$1').toLowerCase());
    }

    static className() {
        return this.name;
    }

    static registerIndex(name) {
        Index.registerIndex(this.getInstance(), name);
    }

    static getIndexByKey(indexName) {
        const className = this.className();
        const currentDatabase = globalThis.Store.database();

        return currentDatabase.getIndexByKey(className, indexName);
    }

    static aSyncInsert(data) {
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                resolve(this.insert(data));
            })
        });
    }

    static insert(data) {
        data = Array.isArray(data) ? data : [data];
        const length = data.length;
        for (let i = 0; i < length; i++) {
            const modelData = data[i];
            const model = this.getInstance();
            model.fill(modelData);
            globalThis.Store.database().insert(this.className(), model);
            model.fillRelations(modelData);
            data[i] = model;
        }
        return data;
    }

    static update(data) {
        const model = new this();
        model.fill(data);
        globalThis.Store.database().update(this.className(), model);

        return model;
    }

    static delete(id) {
        globalThis.Store.database().delete(this.className(), id);
    }

    static find(id) {
        return globalThis.Store.database().find(this.className(), id);
    }

    static select(id) {
        try {
            return globalThis.Store.database().select(this.className(), id);
        } catch (e) {
            console.error(e);
        }
    }

    static all() {
        return globalThis.Store.database().all(this.className());
    }

    static ids() {
        return globalThis.Store.database().ids(this.className());
    }

    get className() {
        return this.constructor.className();
    }

    tableSetup(table) {
        for (let i = 0; i < this.numberOfFields; i++) {
            if (this.originalFields[i] instanceof ForeignKey) {
                this.originalFields[i].tableSetup(table);
            }

            if (this.originalFields[i] instanceof HasManyThrough) {
                this.originalFields[i].tableSetup(table);
            }
        }
    }

    isDirty(fieldName) {
        if (fieldName) {
            return this.dirtyFieldNames.includes(fieldName);
        }
        return this.dirtyFields.length > 0;
    }

    resetDirty() {
        this.originalFields.filter((field) => !(field instanceof Relation)).forEach(field => {
            field.resetDirty();
        })
    }

    delete() {
        this.constructor.delete(this.primaryKey);
    }

    save() {
        const className = this.constructor.className();
        const currentDatabase = globalThis.Store.database();
        const tableIds = currentDatabase.ids(className);

        this.setPrimaryKey();

        if (this.primaryKey[0] !== '_' && tableIds.includes(this._tmpId)) {
            //todo remove indexes for foreignKey
            //                                team_id  this.team_id
            Index.removeTmpIdFromIndex(this);
            currentDatabase.delete(className, this._tmpId);
        }

        Index.updateAllDirtyIndexes(this);

        if (tableIds.includes(this.primaryKey)) {
            currentDatabase.update(className, this);
            return;
        }
        currentDatabase.insert(className, this);
    }

    registerIndex(name) {
        Index.registerIndex(this, name);
    }

    removeFromIndex(foreignKeyField) {
        Index.removeIndex(this, foreignKeyField);
    }

    addToIndex(foreignKeyField) {
        Index.addIndex(this, foreignKeyField);
    }

    fill (data) {
        this.fillPrimaryKey(data);
        for (let i = 0; i < this.numberOfFields; i++) {
            if (!(this.originalFields[i] instanceof Relation)) {
                const fieldName = this.originalFields[i].$name;
                if (data[fieldName] !== undefined) {
                    this[`_${fieldName}`] = data[fieldName];
                }
            }
        }
    }

    fillPrimaryKey(data) {
        for (let i = 0; i < this.numberOfFields; i++) {
            if (this.originalFields[i].isPrimary === true) {
                const fieldName = this.originalFields[i].$name;
                if (data[fieldName] !== undefined) {
                    this[`_${fieldName}`] = data[fieldName];
                }
            }
        }
        this.setPrimaryKey();
    }

    fillRelations(data) {
        // insert through relations after model insert;
        for (let i = 0; i < this.numberOfFields; i++) {
            if ((this.originalFields[i] instanceof Relation)) {
                const fieldName = this.originalFields[i].$name;
                if (data[fieldName] !== undefined) {
                    this[`_${fieldName}`] = data[fieldName];
                }
            }
        }
    }

    setPrimaryKey() {
        if (this.primaryFields.length === 1) {
            this.primaryKeyValue = this[this.primaryFields[0].$name] ?? null;
            return;
        }

        let str = '';

        for (let i = 0; i < this.primaryFields.length; i++) {
            if (i > 0) {
                str += '-';
            }
            str += this[this.primaryFields[i].$name];
        }

        this.primaryKeyValue = str;
    }

    get primaryKey () {
        return this.primaryKeyValue ?? this._tmpId ?? null;
    }

    get primaryKeyName() {
        return this.originalFields.filter(field => field.isPrimary).map(field => field.$name);
    }

    get dirtyFields() {
        return this.originalFields.filter(field => field.isDirty);
    }

    get dirtyFieldNames() {
        return this.dirtyFields.map(field => field.$name);
    }

    addRelationFields(fields) {
        const fieldList = [...fields];
        fields.forEach((field, i) => {
            if (field instanceof Relation) {
                fieldList.splice(i, 0, ...field.getRelationalFields());
            }
        });

        this.numberOfFields = fieldList.length;
        return fieldList;
    }

    setFields(fields) {
        this.originalFields = [...fields];
        this.numberOfFields = this.originalFields.length;
        for (let i = 0; i < this.numberOfFields; i++) {
            this.originalFields[i].setup(this);
        }

        Object.defineProperty(this,
            `indexedFields`, {
                get: () => {
                    return this.originalFields.filter((field) => field instanceof ForeignKey).reduce((set, relation) => {
                        set.add(relation.$name);
                        return set;
                    }, new Set());
                },
            }
        );

        this.primaryFields = this.originalFields.filter(field => field.isPrimary);

        return this;
    }

    toJson(fromRelation) {
        const json = {};

        for (let i = 0; i < this.originalFields.length; i++) {
            const field = this.originalFields[i];

            if (field instanceof Relation && fromRelation) {
                continue;
            }

            json[field.$name] = field.value;

            if (json[field.$name] instanceof Model) {
                json[field.$name] = json[field.$name].toJson(true);
                continue;
            }

            if (json[field.$name]instanceof Array) {
                json[field.$name] = [...json[field.$name].map((value) => {
                    return value?.toJson(true) ?? value
                })];
            }
        }

        return {...json};
    }
}

export {
    Model,
    Field,
    Relation,
    BelongsTo,
    HasOne,
    HasOneThrough,
    HasMany,
    HasManyThrough,
    MorphOne,
    MorphTo,
    ForeignKey,
};