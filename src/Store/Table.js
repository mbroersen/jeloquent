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
        this.splittedIndexNames = {};
        this.primaryKeyFieldNames = model.primaryKeyName;

        this.indexedFields.forEach((indexedField) => {
            this.addIndex(indexedField);
        });
    }

    allModels() {
        return this.models;
    }

    ids() {
        return Object.keys(this.models);
    }

    all() {
        const values = Object.values(this.models);
        const numberOfValues = values.length;
        const collection = new Collection();
        for (let i = 0; i < numberOfValues; i += 10000) {
            collection.push(...values.slice(i, i + 10000));
        }

        return collection;
    }

    insert(model) {
        if (this.models.hasOwnProperty(model.primaryKey)) {
            throw new Error('Record already exists');
        }

        if (!(model instanceof Model)) {
            throw new Error('Record should be instance of model');
        }

        for (let fieldName in this.indexes) {
            const lookUpValue = this.splittedIndexNames[fieldName];
            const length = this.splittedIndexNames[fieldName].length;
            let indexLookUpValue = model;
            for (let i = 0; i < length; i++) {
                if (indexLookUpValue[lookUpValue[i]] === undefined) {
                    indexLookUpValue = undefined;
                    break;
                }
                indexLookUpValue = indexLookUpValue[lookUpValue[i]];
            }

            if (indexLookUpValue === undefined) {
                continue;
            }

            if (this.indexes[fieldName][indexLookUpValue] === undefined) {
                this.indexes[fieldName][indexLookUpValue] = [model.primaryKey];
                continue;
            }
            this.indexes[fieldName][indexLookUpValue].push(model.primaryKey);
        }

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
            this.splittedIndexNames[indexName] = indexName.split('.');
            this.indexes[indexName] = {};
        }
    }

    load() {

    }
}