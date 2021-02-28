import {ForeignKey, Model} from "./Model.js";
import Collection from "./Collection.js";
import Index from "./Table/Index";

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
        this.name = model.constructor.className();
        this.models = new Map();
        this.index = new Index()
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
     * @param indexName
     */
    registerIndex(indexName) {
        this.index.registerIndex(indexName);
    }

    /**
     *
     * @param indexName
     */
    addIndex(indexName, lookUpKey, id) {
        this.index.addIndex(indexName, lookUpKey, id);
    }

    removeIndex(indexName, lookUpKey, id) {
        this.index.removeIndex(indexName, lookUpKey, id)
    }

    getIndexByKey(key) {
        return this.index.getIndexByKey(key);
    }

    get indexes () {
        return this.index.indexes;
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

        this.index.addValueToIndexes(model);
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

        model.dirtyFields.forEach((field) => {
            if (field instanceof ForeignKey) {
                this.index.removeIndex(field.$name, field.originalValue, model.primaryKey);
                this.index.addIndex(field.$name, field.value, model.primaryKey);
            }
        });

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

        this.index.removeValueFromIndex(this.find(id));

        this.models.delete(id);
    }

    /**
     *
     */
    truncate() {
        this.models.clear();
        this.index.truncate();
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
}