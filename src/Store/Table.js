import {Model} from "./Model.js";
import Collection from "./Collection.js";

export default class Table {

    constructor(model) {
        this.setup(model.getInstance());
    }

    setup(model) {
        //todo setup by model;
        this.indexedFields = model.indexedFields;
        this.name = model.constructor.className();
        this.models = {};
        this.indexes = {};
        this.primaryKeyFieldNames = model.primaryKeyName;

        this.indexedFields.forEach((indexedField) => {
            this.indexes[indexedField] = {};
        });
    }

    allModels() {
        return this.models;
    }

    ids() {
        return Object.keys(this.models);
    }

    all() {
        return new Collection(...Object.values(this.models));
    }

    insert(model) {
        if (this.models.hasOwnProperty(model.primaryKey)) {
            throw new Error('Record already exists');
        }

        if (!(model instanceof Model)) {
            throw new Error('Record should be instance of model');
        }

        this.indexedFields.forEach((fieldName) => {
            const lookUpValue = fieldName.split('.');

            const indexLookUpValue = lookUpValue.reduce((object, objectKey) => {
                return object[objectKey];
            }, model);

            const indexes = this.indexes[fieldName][indexLookUpValue] ?? [];
            indexes.push(model.primaryKey);
            this.indexes[fieldName][indexLookUpValue] = indexes;
        })

        this.models[model.primaryKey] = model;
    }

    update(model) {
        if (!this.models.hasOwnProperty(model.primaryKey)) {
            throw new Error('Record doesn\'t exists');
        }

        if (!(model instanceof Model)) {
            throw new Error('Record should be instance of model');
        }

        this.models[model.primaryKey] = model;
    }

    getKey(id) {
        const key = [];
        for (let i = 0; i < this.primaryKeyFieldNames.length; i++) {
            key.push(id[this.primaryKeyFieldNames[i]] ?? '');
        }
        return key.join('-');
    }

    find(id) {
        const hasComposedPrimaryKey = this.primaryKeyFieldNames.length > 1;
        if (Array.isArray(id)) {
            const result = [];
            let pushFunction = hasComposedPrimaryKey ? (i) => {
                result.push(this.models[this.getKey(id[i])] ?? null);
            } : (i) => {
                result.push(this.models[id[i]] ?? null);
            }

            for (let i = 0; i < id.length; i++) {
                pushFunction(i);
            }

            return new Collection(...result);
        }

        if (hasComposedPrimaryKey) {
            return this.models[this.getKey(id)] ?? null;
        }

        return this.models[id] ?? null;
    }

    select(id) {
        if (!this.models.hasOwnProperty(id)) {
            throw new Error('Record doesn\'t exists');
        }

        return this.models[id];
    }

    delete(id) {
        if (!this.models.hasOwnProperty(id)) {
            throw new Error('Record doesn\'t exists');
        }
        //todo remove from indexes;

        delete this.models[id];
    }

    removeFromIndex(indexName, lookUpKey, id) {
        const itemToRemove = this.indexes[indexName][lookUpKey].indexOf(id);
        delete this.indexes[indexName][lookUpKey][itemToRemove];
    }

    addIndex(indexName) {
        if ((indexName in this.indexes) === false) {
            this.indexedFields.push(indexName);
            this.indexes[indexName] = {};
        }
    }

    selectModelsByIndex(key) {
        // todo HasMany.js -> get value(value)

        // if (Store.database().indexes(this.model.className()).hasOwnProperty(this.foreignKey)) {
        //     return Store.database().indexes(this.model.className())[this.foreignKey][this.$parent[this.localKey]].reduce((obj, key) => {
        //         obj.push(Store.database().selectModel(this.model.className(), key));
        //         return obj;
        //     }, []);
        // }
    }
}