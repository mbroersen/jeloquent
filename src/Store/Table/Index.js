import {ForeignKey} from "../Model";

/**
 *
 */
export default class Index {

    /**
     *
     */
    constructor() {
        this.indexes = new Map();
        this.indexedFields = new Set();
        this.splittedIndexNames = new Map();
    }

    /**
     *
     * @param {Model} model
     * @param {string} indexName
     */
    static registerIndex(model, indexName) {
        globalThis.Store.database().registerIndex(model.className, indexName);
    }

    /**
     *
     * @param {Model} model
     * @param {ForeignKey} foreignKeyField
     */
    static addIndex(model, foreignKeyField) {
        globalThis.Store.database().addIndex(model.className, foreignKeyField.foreignKey, foreignKeyField.fieldValue, model.primaryKey);
    }

    /**
     *
     * @param {Model} model
     * @param {ForeignKey} foreignKeyField
     */
    static removeIndex(model, foreignKeyField) {
        globalThis.Store.database().removeIndex(model.className, foreignKeyField.foreignKey, foreignKeyField.previousValue, model.primaryKey);
    }

    /**
     *
     * @param {Model} model
     */
    static removeTmpIdFromIndex(model) {
        let className = model.className;
        model.dirtyFields.filter(field => field instanceof ForeignKey).forEach((field) => {
            globalThis.Store.database().removeIndex(className, field.$name, field.originalValue, model._tmpId);
        });
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
     * @param model
     * @param name
     */
    registerIndex(indexName) {
        if (!this.indexes.has(indexName)) {
            this.indexedFields.add(indexName);
            this.splittedIndexNames.set(indexName, indexName.split('.'));
            this.indexes.set(indexName, new Map());
        }
    }

    /**
     *
     * @param indexName
     * @param lookUpKey
     * @param id
     */
    addValue(indexName, lookUpKey, id) {
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
     * @param {String} indexName
     * @param lookUpKey
     * @param id
     */
    removeValue(indexName, lookUpKey, id) {
        this.indexes?.get(indexName)?.get(lookUpKey)?.delete(id);
    }

    /**
     *
     * @param {string} indexName
     * @param lookUpKey
     * @param id
     */
    registerLookUpKey(indexName, lookUpKey, id) {
        this.indexes?.get(indexName)?.set(lookUpKey, new Set([id]));
    }

    /**
     *
     * @param {string} indexName
     * @param lookUpKey
     */
    unregisterLookUpKey(indexName, lookUpKey) {
        this.indexes?.get(indexName)?.delete(lookUpKey);
    }

    /**
     *
     * @param {Model} model
     * @param {string} fieldName
     * @return {*|null}
     */
    getLookUpValue(model, fieldName) {
        const lookUpValue = this.splittedIndexNames.get(fieldName);
        let indexLookUpValue = model;
        for (const lookUpField of lookUpValue) {
            if (indexLookUpValue[`original_${lookUpField}`] === null) {
                break;
            }
            indexLookUpValue = indexLookUpValue[`original_${lookUpField}`];
        }
        return indexLookUpValue ?? null;
    }

    /**
     *
     * @param {Model} model
     */
    addValueByModel(model) {
        for (let [indexName] of this.indexes) {
            this.addValue(
                indexName,
                this.getLookUpValue(model, indexName),
                model.primaryKey
            );
        }
    }

    /**
     *
     * @param {Model} model
     */
    removeValueByModel(model) {
        for (let [indexName] of this.indexes) {
            this.removeValue(
                indexName,
                this.getLookUpValue(model, indexName),
                model.primaryKey
            );
        }
    }

    /**
     *
     */
    truncate() {
        for (let key in this.indexes) {
            this.indexes.get(key).clear();
        }
    }
}