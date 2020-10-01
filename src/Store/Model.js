import HasManyThrough from './Model/Relation/HasManyThrough.js';
import HasMany from "./Model/Relation/HasMany.js";
import BelongsTo from "./Model/Relation/BelongTo.js";
import Field from "./Model/Field.js";
import Relation from "./Model/Relation.js";

class Model {

    constructor(fields) {
        this.setFields(fields);
    }

    static className() {
        return this.name;
    }

    static getInstance() {
        const original =  window.Store.classInstances[this.className()] ?? (window.Store.classInstances[this.className()] = new this())
        const fieldsClone = original.originalFields.reduce((obj, field) => {
            obj.push(Object.assign(Object.create(Object.getPrototypeOf(field)), field));
            return obj;
        } ,[])

        return Object.create(Object.getPrototypeOf(original)).setFields(fieldsClone);
    }


    static insert(data) {
        data = Array.isArray(data) ? data : [data];

        data.map((modelData) => {
            const model = this.getInstance();
            model.fill(modelData);
            window.Store.database().insert(this.className(), model);
            return model;
        });

        return data;
    }

    static update(data) {
        const model = new this();
        model.fill(data);
        window.Store.database().update(this.className(), model);

        return model;
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


    fill (data) {
        for (const fieldName in data) {
            if (this.hasOwnProperty(fieldName)) {
                this[`_${fieldName}`] = data[fieldName];
            }
        }
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

    setFields(fields) {
        this.originalFields = fields;
        this.fields = {};
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


        return this;
    }

    toJson(fromRelation) {
        const json = {};

        Object.keys(this.fields).forEach((fieldName) => {
            json[fieldName] = this.fields[fieldName].value;

            if (fromRelation) {
                return;
            }

            if (json[fieldName] instanceof Model) {
                json[fieldName] = {...json[fieldName].toJson(true)};
                return;
            }

            if (json[fieldName] instanceof Array) {
                json[fieldName] = [...json[fieldName].map((value) => value?.toJson(true) ?? value)];
            }
        });

        return json;
    }
}

export {
    Model,
    Field,
    Relation,
    BelongsTo,
    HasMany,
    HasManyThrough,
};