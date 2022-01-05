import {ForeignKey} from "../Model";
import {IndexInterface, ModelInterface} from "../../JeloquentInterfaces";
import Field from "../Model/Field";

/**
 *
 */
export default class Index implements IndexInterface {

    private _indexes: Map<string, Map<string|number, Set<string|number>>>;

    indexedFields: Set<string>;

    splitIndexNames: Map<string, Array<string>>

    /**
     *
     */
    constructor() {
        this._indexes = new Map();
        this.indexedFields = new Set();
        this.splitIndexNames = new Map();
    }

    private index(index: string): Map<string|number, Set<string|number>> {
        return this._indexes.get(index);
    }

    private indexLookUpKey(index: string, key: string): Set<string|number> {
        return this.index(index).get(key);
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

    get indexes(): Map<string, Map<string|number, Set<string|number>>> {
        return this._indexes;
    }

    /**
     *
     * @param key
     * @return {any}
     */
    getIndexByKey(key: string): Map<string|number, Set<string|number>> {
        return this.index(key);
    }

    /** @deprecated **/
    registerIndex(indexName) {
        this.register(indexName);
    }

    register(indexName: string): void {
        if (!this._indexes.has(indexName)) {
            this.indexedFields.add(indexName);
            this.splitIndexNames.set(indexName, indexName.split('.'));
            this._indexes.set(indexName, new Map());
        }
    }

    /**
     *
     * @param indexName
     * @param lookUpKey
     * @param id
     */
    addValue(indexName, lookUpKey, id): void {
        if (!this._indexes.has(indexName) || id === null) {
            return;
        }

        const index = this.index(indexName);
        if (!(index.has(lookUpKey))) {
            this.registerLookUpKey(indexName, lookUpKey, id);
            return;
        }
        const keys = this.indexLookUpKey(indexName, lookUpKey);
        if (keys.has(id)) {
            return;
        }
        keys.add(id);
    }

    /**
     *
     * @param {String} indexName
     * @param lookUpKey
     * @param id
     */
    removeValue(indexName, lookUpKey, id) {
        this.indexLookUpKey(indexName, lookUpKey).delete(id);
    }

    /**
     *
     * @param {string} indexName
     * @param lookUpKey
     * @param id
     */
    registerLookUpKey(indexName, lookUpKey, id) {
        this.index(indexName).set(lookUpKey, new Set([id]));
    }

    /**
     *
     * @param {string} indexName
     * @param lookUpKey
     */
    unregisterLookUpKey(indexName, lookUpKey) {
        this.index(indexName).delete(lookUpKey);
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

    addValueByModel(model: ModelInterface) {
        for (const [indexName] of this._indexes) {
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
        for (const [indexName] of this._indexes) {
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
        for (const key in this._indexes) {
            this.index(key).clear();
        }
    }
}