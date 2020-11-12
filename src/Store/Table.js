import {Model} from "./Model.js";
import Collection from "./Collection.js";

export default class Table {

    constructor(model) {
        this.setup(model.getInstance());
    }

    setup(model) {
        //todo setup by model;
        this.model = model;
        this.indexedFields = model.indexedFields;
        this.name = model.constructor.className();
        this.models = {};
        this.indexes = {};
        this.splittedIndexNames = {};
        this.primaryKeyFieldNames = model.primaryKeyName;
    }

    setupIndexes() {
        this.model.tableSetup(this);
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
        if (Object.prototype.hasOwnProperty.call(this.models, model.primaryKey)) {
            throw new Error('Record already exists');
        }

        if (!(model instanceof Model)) {
            throw new Error('Record should be instance of model');
        }

        if (model.primaryKey != null) {
            this.models[model.primaryKey] = model;
        }

        this.addValueToIndexes(model);
    }

    addValueToIndexes(model) {
        const indexes = this.indexes;

        for (let fieldName in indexes) {
            const lookUpValue = this.splittedIndexNames[fieldName];
            const length = this.splittedIndexNames[fieldName].length;
            let indexLookUpValue = model;
            for (let i = 0; i < length; i++) {
                if (indexLookUpValue[lookUpValue[i]] === null) {
                    indexLookUpValue = undefined;
                    break;
                }
                indexLookUpValue = indexLookUpValue[lookUpValue[i]];
            }

            if (indexLookUpValue === undefined) {
                continue;
            }

            if (indexes[fieldName][indexLookUpValue] === undefined) {
                indexes[fieldName][indexLookUpValue] = [model.primaryKey];
                continue;
            }

            if (indexes[fieldName][indexLookUpValue].indexOf(model.primaryKey) === -1) {
                indexes[fieldName][indexLookUpValue].push(model.primaryKey);
            }
        }
    }

    update(model) {
        if (!Object.prototype.hasOwnProperty.call(this.models, model.primaryKey)) {
            throw new Error('Record doesn\'t exists');
        }

        if (!(model instanceof Model)) {
            throw new Error('Record should be instance of model');
        }

        this.models[model.primaryKey] = model;
    }

    getKey(id) {
        if (typeof id === 'string') {
            return id;
        }

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
        if (!Object.prototype.hasOwnProperty.call(this.models, id)) {
            throw new Error('Record doesn\'t exists');
        }

        return this.models[id];
    }

    delete(id) {
        if (!Object.prototype.hasOwnProperty.call(this.models, id)) {
            throw new Error('Record doesn\'t exists');
        }
        //todo remove from indexes;

        delete this.models[id];
    }

    removeFromIndex(indexName, lookUpKey, id) {
        if (!Object.prototype.hasOwnProperty.call(this.indexes, indexName)) {
            return;
        }

        if (!Object.prototype.hasOwnProperty.call(this.indexes[indexName], lookUpKey)) {
            return;
        }

        const itemToRemove = this.indexes[indexName][lookUpKey].indexOf(id);
        if (itemToRemove !== -1) {
            return;
        }

        delete this.indexes[indexName][lookUpKey][itemToRemove];
    }

    addToIndex(indexName, lookUpKey, id) {
        if (!Object.prototype.hasOwnProperty.call(this.indexes, indexName)) {
            return;
        }

        if (this.indexes[indexName][lookUpKey] === undefined) {

            this.indexes[indexName][lookUpKey] = [id];
            return;
        }

        this.indexes[indexName][lookUpKey].push(id);
    }

    addIndex(indexName) {
        if ((indexName in this.indexes) === false) {
            this.indexedFields.push(indexName);
            this.splittedIndexNames[indexName] = indexName.split('.');
            this.indexes[indexName] = {};
        }
    }

    truncate() {
        this.models = {};

        for (const indexName in this.indexes) {
            this.indexes[indexName] = {};
        }
    }

    load() {

    }
}