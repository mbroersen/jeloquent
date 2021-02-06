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
        this.models = new Map();
        this.indexes = new Map();
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
        return [...this.models.keys()];
    }

    getIndexByKey(key) {
        return this.indexes.get(key);
    }

    all() {
        const values = [...this.models.values()];
        const numberOfValues = values.length;
        const collection = new Collection();
        for (let i = 0; i < numberOfValues; i += 10000) {
            collection.push(...values.slice(i, i + 10000));
        }

        return collection;
    }

    insert(model) {
        if (this.models.has(model.primaryKey)) {
            throw new Error('Record already exists');
        }

        if (!(model instanceof Model)) {
            throw new Error('Record should be instance of model');
        }

        model.resetDirty();

        if (model.primaryKey != null) {
            this.models.set(model.primaryKey, model);
        }

        this.addValueToIndexes(model);
    }

    addValueToIndexes(model) {
        const indexes = this.indexes;

        for (let [fieldName, value] of indexes) {
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

            let current = value;
            if (!(current.get(indexLookUpValue) instanceof Set)) {
                current.set(indexLookUpValue, new Set());
            }

            current = current.get(indexLookUpValue);
            current.add(model.primaryKey, model.primaryKey);
        }
    }

    update(model) {
        if (!this.models.has(model.primaryKey)) {
            throw new Error('Record doesn\'t exists');
        }

        if (!(model instanceof Model)) {
            throw new Error('Record should be instance of model');
        }

        //check for dirty fields
        //update related indexes of dirty fields
        model.resetDirty();

        this.models.set(model.primaryKey, model);
    }

    getKey(id) {
        if (typeof id === 'string') {
            return id;
        }

        if (id === null) {
            return null;
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
                result.push(this.models.get(this.getKey(id[i])) ?? null);
            } : (i) => {
                result.push(this.models.get(id[i]) ?? null);
            }

            for (let i = 0; i < id.length; i++) {
                pushFunction(i);
            }

            return new Collection(...result);
        }

        if (hasComposedPrimaryKey) {
            return this.models.get(this.getKey(id)) ?? null;
        }

        return this.models.get(id) ?? null;
    }

    select(id) {
        if (!this.models.has(id)) {
            throw new Error('Record doesn\'t exists');
        }

        return this.find(id);
    }

    delete(id) {
        if (!this.models.has(id)) {
            throw new Error('Record doesn\'t exists');
        }
        this.models.delete(id);
    }

    removeFromIndex(indexName, lookUpKey, id) {
        if (!this.indexes.has(indexName)) {
            return;
        }
        let current = this.indexes.get(indexName);
        if (!current.has(lookUpKey)) {
            return;
        }

        current = current.get(lookUpKey);
        current?.delete(id);
    }

    addToIndex(indexName, lookUpKey, id) {
        if (!this.indexes.has(indexName) || id === null) {
            return;
        }

        let current = this.indexes.get(indexName);
        if (!(current instanceof Map && current.has(lookUpKey))) {
            current.set(lookUpKey, new Set());
            return;
        }
        current = current.get(lookUpKey);

        if (current.has(id)) {
            return;
        }

        current.add(id);
    }

    addIndex(indexName) {
        if (!this.indexes.has(indexName)) {
            this.indexedFields.push(indexName);
            this.splittedIndexNames[indexName] = indexName.split('.');
            this.indexes.set(indexName, new Map());
        }
    }

    truncate() {
        this.models.clear();

        for (let key in this.indexes) {
            this.indexes.get(key).clear();
        }
    }

    load() {

    }
}