import HasManyThrough from './Model/Relation/HasManyThrough.js';
import HasMany from "./Model/Relation/HasMany.js";
import BelongsTo from "./Model/Relation/BelongTo.js";
import MorphOne from "./Model/Relation/MorphOne.js";
import HasOne from "./Model/Relation/HasOne.js";
import MorphTo from "./Model/Field/MorphTo.js";

import Field from "./Model/Field.js";
import Relation from "./Model/Relation.js";

class Model {

    constructor(fields) {
        this.setFields(fields);
        this._tmpId = `_${++Store.numberOfModelCreated}`;
        this.snakeCaseName = this.constructor.snakeCaseClassName();
    }

    static snakeCaseClassName() {
        return (this.name[0].toLowerCase() + this.name.slice(1).replace(/([A-Z])/g, '_$1').toLowerCase());
    }

    static className() {
        return this.name;
    }

    static addIndex(name) {
        window.Store.database().addIndex(this.className(), name);
    }

    static getInstance() {
        const original =  window.Store.classInstances[this.className()] ?? (window.Store.classInstances[this.className()] = new this())
        const fieldsClone = original.originalFields.reduce((obj, field) => {
            obj.push(Object.assign(Object.create(Object.getPrototypeOf(field)), field));
            return obj;
        } ,[])

        return Object.create(Object.getPrototypeOf(original)).setFields(fieldsClone);
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
            window.Store.database().insert(this.className(), model);
            data[i] = model;
        }
        return data;
    }

    static update(data) {
        const model = new this();
        model.fill(data);
        window.Store.database().update(this.className(), model);

        return model;
    }

    static find(id) {
        return window.Store.database().find(this.className(), id);
    }

    static select(id) {
        try {
            return window.Store.database().select(this.className(), id);
        } catch (e) {

        }
    }

    static delete(id) {
        window.Store.database().delete(this.className(), id);
    }

    static all() {
        return window.Store.database().all(this.className());
    }

    static ids() {
        return window.Store.database().ids(this.className());
    }

    save() {
        const className = this.constructor.className();
        const currentDatabase =  Store.database();
        const tableIds = currentDatabase.ids(className);

        this.setPrimaryKey();

        if (this.primaryKey[0] !== '_' && tableIds.includes(this._tmpId)) {
            //todo remove indexes for foreignKey
            //                                team_id  this.team_id
            //currentDatabase.removeFromIndex(indexName, lookUpKey, this._tmpId);
            currentDatabase.delete(className, this._tmpId);
        }

        if (tableIds.includes(this.primaryKey)) {
            currentDatabase.update(className, this);
            return;
        }
        currentDatabase.insert(className, this);
    }


    fill (data) {
        const fillableFields = this.originalFields;
        const numberOfFillableFields = this.originalFields.length;
        
        for (let i = 0; i < numberOfFillableFields; i++) {
            const fieldName = fillableFields[i].$name;
            
            if (data[fieldName] !== undefined) {
                this[`_${fieldName}`] = data[fieldName];
            }
        }

        this.setPrimaryKey();
    }

    setPrimaryKey() {
        let str = '';

        for (let i = 0; i < this.primaryFields.length; i++) {
            if (i > 0) {
                str += '-';
            }
            str += this[this.primaryFields[i].$name];
        }

        this.primaryKeyValue = str;
    }

    belongsTo(model, foreignKey) {
        foreignKey = foreignKey ?? `${model.className().toLowerCase()}_id`;
        const belongsTo = new BelongsTo(model, foreignKey);
        belongsTo.setup(this);
        return belongsTo;
    }

    hasMany(model, foreignKey) {
        foreignKey = foreignKey ?? `${this.constructor.className().toLowerCase()}_id`;
        const hasMany = new HasMany(model, foreignKey);
        hasMany.setup(this);
        return hasMany;
    }

    get primaryKey () {
        return this.primaryKeyValue ?? this._tmpId;
    }

    get primaryKeyName() {
        return this.originalFields.filter(field => field.isPrimary).map(field => field.$name);
    }

    setFields(fields) {
        this.originalFields = fields;
        fields.forEach((field) => {
            field.setup(this);
        });

        Object.defineProperty(this,
            `indexedFields`, {
                get: () => {
                    return fields.filter((field) => field instanceof BelongsTo).reduce((array, relation) => {
                        array.push(relation.foreignKey);
                        return array;
                    }, []);
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
    HasMany,
    HasManyThrough,
    MorphOne,
    MorphTo,
};