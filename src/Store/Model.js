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

/**
 *
 */
class Model {

    /**
     *
     * @param fields
     */
    constructor(fields) {
        this.setFields(this.addRelationFields(fields));
        this._tmpId = `_${++globalThis.Store.numberOfModelCreated}`;
    }

    /**
     *
     * @return {*}
     */
    get className() {
        return this.constructor.className;
    }

    /**
     *
     * @return {string|null}
     */
    get primaryKey() {
        return this.primaryFields.reduce((toValue, field, i) => {
            if (i > 0) {
                return `${toValue}-${field.value}`;
            }
            return field.value;
        }, '') ?? this._tmpId ?? null;
    }

    /**
     *
     * @return {string|null}
     */
    get originalPrimaryKey() {
        return this.primaryFields.reduce((toValue, field, i) => {
            if (i > 0) {
                return `${toValue}-${field.originalValue}`;
            }
            return field.originalValue;
        }, '') ?? this._tmpId ?? null;
    }


    /**
     *
     * @return {(string|*)[]}
     */
    get primaryKeyName() {
        return this.originalFields.filter(field => field.isPrimary).map(field => field.$name);
    }

    /**
     *
     * @return {T}
     */
    get originalValues() {
        return this.originalFields.reduce((originalValues, field) => {
            if (field.originalValue !== undefined) {
                originalValues[field.$name] = field.originalValue;
            }
            return originalValues;
        }, {});
    }

    /**
     *
     * @return {T[]}
     */
    get dirtyFields() {
        return this.originalFields.filter(field => field.isDirty);
    }

    /**
     *
     * @return {*}
     */
    get dirtyFieldNames() {
        return this.dirtyFields.map(field => field.$name);
    }

    /**
     *
     * @return {string}
     */
    get snakeCaseClassName() {
        return this.constructor.snakeCaseClassName;
    }

    /**
     *
     * @return {string}
     */
    get kebabCaseClassName() {
        return this.constructor.kebabCaseClassName;
    }

    /**
     *
     * @return {string}
     */
    static get snakeCaseClassName() {
        if (!this.snakeCaseName) {
            this.snakeCaseName = (this.name[0].toLowerCase() + this.name.slice(1).replace(/([A-Z])/g, '_$1').toLowerCase());
        }

        return this.snakeCaseName;
    }

    /**
     *
     * @return {string}
     */
    static get kebabCaseClassName() {
        if (!this.kebabCaseName) {
            this.kebabCaseName = (this.name[0].toLowerCase() + this.name.slice(1).replace(/([A-Z])/g, '-$1').toLowerCase())
        }

        return this.kebabCaseName;
    }

    /**
     *
     * @return {string}
     */
    static get className() {
        return this.name;
    }

    /**
     *
     * @return {Model}
     */
    static getInstance() {
        const original = globalThis.Store.classInstances[this.className] ?? (globalThis.Store.classInstances[this.className] = new this())
        const fieldsClone = original.originalFields.reduce((obj, field) => {
            obj.push(Object.assign(Object.create(Object.getPrototypeOf(field)), field));
            return obj;
        }, [])

        return Object.create(Object.getPrototypeOf(original)).setFields(fieldsClone);
    }


    /**
     *
     * @param name
     */
    static registerIndex(name) {
        Index.registerIndex(this.getInstance(), name);
    }

    /**
     *
     * @param indexName
     * @return {*}
     */
    static getIndexByKey(indexName) {
        const className = this.className;
        const currentDatabase = globalThis.Store.database();

        return currentDatabase.getIndexByKey(className, indexName);
    }

    /**
     *
     * @param data
     * @return {Promise<unknown>}
     */
    static aSyncInsert(data) {
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                resolve(this.insert(data));
            })
        });
    }

    /**
     *
     * @param data
     * @return {*|*[]}
     */
    static insert(data) {
        data = Array.isArray(data) ? data : [data];
        const length = data.length;
        for (let i = 0; i < length; i++) {
            const modelData = data[i];
            const model = this.getInstance();
            model.fill(modelData);
            globalThis.Store.database().insert(this.className, model);
            model.fillRelations(modelData);
            data[i] = model;
        }
        return data;
    }

    /**
     *
     * @param data
     * @return {Model}
     */
    static update(data) {
        const model = new this();
        model.fill(data);
        globalThis.Store.database().update(this.className, model);

        return model;
    }

    /**
     *
     * @param id
     */
    static delete(id) {
        globalThis.Store.database().delete(this.className, id);
    }

    /**
     *
     * @param id
     * @return {*}
     */
    static find(id) {
        return globalThis.Store.database().find(this.className, id);
    }

    /**
     *
     * @param id
     * @return {*}
     */
    static select(id) {
        try {
            return globalThis.Store.database().select(this.className, id);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     *
     * @return {*}
     */
    static all() {
        return globalThis.Store.database().all(this.className);
    }

    /**
     *
     * @return {*[]|*}
     */
    static ids() {
        return globalThis.Store.database().ids(this.className);
    }

    /**
     *
     * @param table
     */
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

    /**
     *
     * @param fieldName
     * @return {boolean|*}
     */
    isDirty(fieldName) {
        if (fieldName) {
            return this.dirtyFieldNames.includes(fieldName);
        }
        return this.dirtyFields.length > 0;
    }

    /**
     *
     */
    resetDirty() {
        this.originalFields.filter((field) => !(field instanceof Relation)).forEach(field => {
            field.resetDirty();
        })
    }

    /**
     *
     */
    delete() {
        this.constructor.delete(this.primaryKey);
    }

    /**
     *
     */
    save() {
        const className = this.className;
        const currentDatabase = globalThis.Store.database();
        const tableIds = currentDatabase.ids(className);

        if (this.primaryKey[0] !== '_' && tableIds.includes(this._tmpId)) {
            //todo remove indexes for foreignKey
            //                                team_id  this.team_id
            Index.removeTmpIdFromIndex(this);
            currentDatabase.delete(className, this._tmpId);
        }

        if (tableIds.includes(this.primaryKey)) {
            currentDatabase.update(className, this);
            return;
        }
        currentDatabase.insert(className, this);
    }

    /**
     *
     * @param name
     */
    registerIndex(name) {
        Index.registerIndex(this, name);
    }

    /**
     *
     * @param data
     */
    fill(data) {
        for (let i = 0; i < this.numberOfFields; i++) {
            if (!(this.originalFields[i] instanceof Relation)) {
                const fieldName = this.originalFields[i].$name;
                if (data[fieldName] !== undefined) {
                    this[`_${fieldName}`] = data[fieldName];
                }
            }
        }
    }


    /**
     *
     * @param data
     */
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

    /**
     *
     * @param fields
     * @return {*[]}
     */
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

    /**
     *
     * @param fields
     * @return {Model}
     */
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

    /**
     * @return {string}
     */
    jsonStringify() {
        return JSON.stringify(this.toObject());
    }

    /**
     * @deprecated
     * @return {{}}
     */
    toJson() {
        return this.toObject();
    }

    /**
     *
     * @param fromRelation
     * @return {{}}
     */
    toObject(fromRelation) {
        const json = {};

        for (let i = 0; i < this.originalFields.length; i++) {
            const field = this.originalFields[i];

            if (field instanceof Relation && fromRelation) {
                continue;
            }

            json[field.$name] = field.value;

            if (json[field.$name] instanceof Model) {
                json[field.$name] = json[field.$name].toObject(true);
                continue;
            }

            if (json[field.$name] instanceof Array) {
                json[field.$name] = [...json[field.$name].map((value) => {
                    return value?.toObject(true) ?? value
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