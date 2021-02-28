import {ForeignKey} from "../Model";

/**
 *
 */
export default class Index {

    constructor() {
        this.indexes = new Map();
        this.indexedFields = new Set();
        this.splittedIndexNames = new Map();
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
     * @param value
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

    registerLookUpKey(indexName, lookUpKey, id) {
        this.indexes?.get(indexName)?.set(lookUpKey, new Set([id]));
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
     * @param model
     * @param fieldName
     * @return {null}
     */
    getIndexLookUpValue(model, fieldName) {
        const lookUpValue = this.splittedIndexNames.get(fieldName);
        let indexLookUpValue = model;
        for (const lookUpField of lookUpValue) {
            if (indexLookUpValue[lookUpField] === null) {
                break;
            }
            indexLookUpValue = indexLookUpValue[lookUpField];
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

    truncate() {
        for (let key in this.indexes) {
            this.indexes.get(key).clear();
        }
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
     * @param model
     * @param name
     */
    static registerIndex(model, name) {
        globalThis.Store.database().registerIndex(model.constructor.className(), name);
    }

    /**
     *
     * @param model
     * @param foreignKeyField
     */
    static addIndex(model, foreignKeyField) {
        globalThis.Store.database().addIndex(model.className, foreignKeyField.foreignKey, foreignKeyField.fieldValue, model.primaryKey);
    }

    /**
     *
     * @param model
     * @param foreignKeyField
     */
    static removeIndex(model, foreignKeyField) {
        globalThis.Store.database().removeIndex(model.className, foreignKeyField.foreignKey, foreignKeyField.previousValue, model.primaryKey);
    }

    /**
     *
     * @param model
     */
    static removeTmpIdFromIndex(model) {
        let className = model.className;
        model.dirtyFields.filter(field => field instanceof ForeignKey).forEach((field) => {
            globalThis.Store.database().removeIndex(className, field.$name, field.originalValue, model._tmpId);
        });
    }
}