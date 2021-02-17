import {Model} from "./Model.js";
import Collection from "./Collection.js";

/**
 *
 */
export default class Table {

    /**
     *
     * @param model
     */
    constructor(model) {
        this.setup(model.getInstance());
    }

    /**
     *
     * @param model
     */
    setup(model) {
        this.model = model;
        this.indexedFields = model.indexedFields;
        this.name = model.constructor.className();
        this.models = new Map();
        this.indexes = new Map();
        this.splittedIndexNames = {};
        this.primaryKeyFieldNames = model.primaryKeyName;
    }

    /**
     *
     */
    setupIndexes() {
        this.model.tableSetup(this);
    }

    /**
     *
     * @return {Map<any, any>}
     */
    allModels() {
        return this.models;
    }

    /**
     *
     * @return {any[]}
     */
    ids() {
        return [...this.models.keys()];
    }

    /**
     *
     * @param key
     * @return {any}
     */
    getIndexByKey(key) {
        return this.indexes.get(key);
    }

    /**
     *
     * @return {Collection}
     */
    all() {
        const values = [...this.models.values()];
        const numberOfValues = values.length;
        const collection = new Collection();
        for (let i = 0; i < numberOfValues; i += 10000) {
            collection.push(...values.slice(i, i + 10000));
        }

        return collection;
    }

    /**
     *
     * @param model
     * @param fieldName
     * @return {null}
     */
    getIndexLookUpValue(model, fieldName) {
        const lookUpValue = this.splittedIndexNames[fieldName];
        const length = this.splittedIndexNames[fieldName].length;
        let indexLookUpValue = model;
        for (let i = 0; i < length; i++) {
            if (indexLookUpValue[lookUpValue[i]] === null) {
                break;
            }
            indexLookUpValue = indexLookUpValue[lookUpValue[i]];
        }
        return indexLookUpValue ?? null;
    }

    /**
     *
     * @param model
     */
    addValueToIndexes(model) {
        for (let [fieldName, value] of this.indexes) {
            let indexLookUpValue = this.getIndexLookUpValue(model, fieldName);
            if (indexLookUpValue === null) {
                continue;
            }

            let current = value;
            if (!(current.get(indexLookUpValue) instanceof Set)) {
                current.set(indexLookUpValue, new Set());
            }
            current.get(indexLookUpValue)?.add(model.primaryKey);
        }
    }

    /**
     *
     * @param model
     */
    removeValueFromIndex(model) {
        for (let [fieldName, value] of this.indexes) {
            let indexLookUpValue = this.getIndexLookUpValue(model, fieldName);
            if (!indexLookUpValue || !value.has(indexLookUpValue)) {
                continue;
            }
            value?.get(indexLookUpValue)?.delete(model.primaryKey);
        }
    }

    /**
     *
     * @param model
     */
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

    /**
     *
     * @param model
     */
    update(model) {
        if (!this.models.has(model.primaryKey)) {
            throw new Error('Record doesn\'t exists');
        }

        if (!(model instanceof Model)) {
            throw new Error('Record should be instance of model');
        }

        model.resetDirty();

        this.models.set(model.primaryKey, model);
    }

    /**
     *
     * @param id
     */
    delete(id) {
        if (!this.models.has(id)) {
            throw new Error('Record doesn\'t exists');
        }

        this.removeValueFromIndex(this.find(id));

        this.models.delete(id);
    }

    /**
     *
     */
    truncate() {
        this.models.clear();

        for (let key in this.indexes) {
            this.indexes.get(key).clear();
        }
    }

    /**
     *
     * @param id
     * @return {string|null}
     */
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

    /**
     *
     * @param id
     * @return {any|null|Collection}
     */
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

    /**
     *
     * @param id
     * @return {Collection|*}
     */
    select(id) {
        if (!this.models.has(id)) {
            throw new Error('Record doesn\'t exists');
        }

        return this.find(id);
    }

    /**
     *
     * @param indexName
     * @param lookUpKey
     * @param id
     */
    removeIndex(indexName, lookUpKey, id) {
        this.indexes?.get(indexName)?.get(lookUpKey)?.delete(id);
    }

    /**
     *
     * @param indexName
     * @param lookUpKey
     * @param id
     */
    addIndex(indexName, lookUpKey, id) {
        if (!this.indexes.has(indexName) || id === null) {
            return;
        }

        let current = this.indexes?.get(indexName);
        if (!(current.has(lookUpKey))) {
            this.registerLookUpKey(indexName, lookUpKey, id);
            return;
        }
        current = current?.get(lookUpKey);

        if (current.has(id)) {
            return;
        }

        current.add(id);
    }

    /**
     *
     * @param indexName
     * @param lookUpKey
     */
    unregisterLookUpKey(indexName, lookUpKey) {
        this.indexes?.get(indexName)?.delete(lookUpKey);
    }

    /**
     *
     * @param indexName
     * @param lookUpKey
     * @param id
     */
    registerLookUpKey(indexName, lookUpKey, id) {
        this.indexes?.get(indexName)?.set(lookUpKey, new Set([id]));
    }

    /**
     *
     * @param indexName
     */
    registerIndex(indexName) {
        if (!this.indexes.has(indexName)) {
            this.indexedFields.add(indexName);
            this.splittedIndexNames[indexName] = indexName.split('.');
            this.indexes.set(indexName, new Map());
        }
    }
}