import {ForeignKey} from "../Model";
import {IndexInterface, ModelInterface} from "../../JeloquentInterfaces";
import Field from "../Model/Field";

/**
 *
 */
export default class Index implements IndexInterface {

    indexes:Map<string, Map<string, Map<number, Set<string>>>>;
    indexedFields:Set<string>;
    splitIndexNames:Map<string, Array<string>>

    /**
     *
     */
    constructor() {
        this.indexes = new Map();
        this.indexedFields = new Set();
        this.splitIndexNames = new Map();
    }

    /**
     * @deprecated
     */
    static registerIndex(model, indexName) {
        this.register(model, indexName)
    }

    static register(model: ModelInterface, indexName: string): void {
        globalThis.Store.database().registerIndex(model.className, indexName);
    }

    /**
     * @deprecated
     */
    static addIndex(model, foreignKeyField) {
        this.add(model, foreignKeyField);
    }

    static add(model:ModelInterface, foreignKeyField: Field): void {
        globalThis.Store.database().addIndex(model.className, foreignKeyField.foreignKey, foreignKeyField.fieldValue, model.primaryKey);
    }

    /**
     * @deprecated
     */
    static removeIndex(model, foreignKeyField) {
        this.remove(model, foreignKeyField);
    }

    static remove(model:ModelInterface, foreignKeyField: Field): void {
        globalThis.Store.database().removeIndex(model.className, foreignKeyField.foreignKey, foreignKeyField.previousValue, model.primaryKey);
    }

    /**
     *
     * @param {Model} model
     */
    static removeTmpIdFromIndex(model) {
        const className = model.className;
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
            this.splitIndexNames.set(indexName, indexName.split('.'));
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
    getLookUpValue(model, fieldName: string) {
        const lookUpValue = this.splitIndexNames.get(fieldName);
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