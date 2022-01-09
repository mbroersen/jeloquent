import {ForeignKey} from "../Model";
import {IndexInterface, ModelInterface} from "../../JeloquentInterfaces";
import Field from "../Model/Field";

export default class Index implements IndexInterface {

    private _indexes: Map<string, Map<string|number, Set<string|number>>>;

    private indexedFields: Set<string>;

    private splitIndexNames: Map<string, Array<string>>;

    constructor() {
        this._indexes = new Map();
        this.indexedFields = new Set();
        this.splitIndexNames = new Map();
    }

    get indexes(): Map<string, Map<string|number, Set<string|number>>> {
        return this._indexes;
    }

    static add(model: ModelInterface, foreignKeyField: ForeignKey): void {
        globalThis.Store.database().addIndex(model.className, foreignKeyField.foreignKey, foreignKeyField.value, model.primaryKey);
    }

    /**
     * @deprecated
     */
    static addIndex(model: ModelInterface, foreignKeyField:ForeignKey): void {
        this.add(model, foreignKeyField);
    }

    static register(model: ModelInterface, indexName: string): void {
        globalThis.Store.database().registerIndex(model.className, indexName);
    }

    /**
     * @deprecated
     */
    static registerIndex(model: ModelInterface, indexName: string): void {
        this.register(model, indexName)
    }

    static remove(model: ModelInterface, foreignKeyField: ForeignKey): void {
        globalThis.Store.database().removeIndex(model.className, foreignKeyField.foreignKey, foreignKeyField.previousValue, model.primaryKey);
    }

    /**
     * @deprecated
     */
    static removeIndex(model: ModelInterface, foreignKeyField: ForeignKey): void {
        this.remove(model, foreignKeyField);
    }

    static removeTmpIdFromIndex(model: ModelInterface) {
        const className = model.className;
        model.dirtyFields.filter(field => field instanceof ForeignKey).forEach((field) => {
            globalThis.Store.database().removeIndex(className, field.name, field.originalValue, model._tmpId);
        });
    }

    public addValue(indexName: string, lookUpKey:string|number, id:string|number): void {
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

    public addValueByModel(model: ModelInterface) {
        for (const [indexName] of this._indexes) {
            this.addValue(
                indexName,
                this.getLookUpValue(model, indexName),
                model.primaryKey
            );
        }
    }

    public getIndexByKey(key: string): Map<string|number, Set<string|number>> {
        return this.index(key);
    }

    public getLookUpValue(model: ModelInterface, fieldName: string): string|number|null {
        const lookUpValue = this.splitIndexNames.get(fieldName);
        let returnValue = null;
        let indexLookUpValue = model;
        for (const lookUpField of lookUpValue) {
            if (indexLookUpValue[`original_${lookUpField}`] === null) {
                break;
            }
            indexLookUpValue = indexLookUpValue[`original_${lookUpField}`];
            returnValue = indexLookUpValue;
        }

        return returnValue ?? null;
    }

    public register(indexName: string): void {
        if (!this._indexes.has(indexName)) {
            this.indexedFields.add(indexName);
            this.splitIndexNames.set(indexName, indexName.split('.'));
            this._indexes.set(indexName, new Map());
        }
    }

    /**
     * @deprecated
     */
    public registerIndex(indexName: string): void {
        this.register(indexName);
    }

    public registerLookUpKey(indexName, lookUpKey, id) {
        this.index(indexName).set(lookUpKey, new Set([id]));
    }

    public removeValue(indexName: string, lookUpKey:string|number, id:string|number): void {
        this.indexLookUpKey(indexName, lookUpKey).delete(id);
    }

    public removeValueByModel(model: ModelInterface): void {
        for (const [indexName] of this._indexes) {
            this.removeValue(
                indexName,
                this.getLookUpValue(model, indexName),
                model.primaryKey
            );
        }
    }

    public truncate(): void {
        for (const key in this._indexes) {
            this.index(key).clear();
        }
    }

    public unregisterLookUpKey(indexName:string, lookUpKey:string|number): void {
        this.index(indexName).delete(lookUpKey);
    }

    private index(index: string): Map<string|number, Set<string|number>> {
        return this._indexes.get(index);
    }

    private indexLookUpKey(index: string, key: string|number): Set<string|number> {
        return this.index(index).get(key);
    }
}