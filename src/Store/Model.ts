import HasManyThrough from './Model/Relation/HasManyThrough';
import HasMany from "./Model/Relation/HasMany";
import BelongsTo from "./Model/Relation/BelongTo";
import MorphOne from "./Model/Relation/MorphOne";
import HasOne from "./Model/Relation/HasOne";
import HasOneThrough from "./Model/Relation/HasOneThrough";
import MorphTo from "./Model/Field/MorphTo";
import Field from "./Model/Field";
import Relation from "./Model/Relation";
import ForeignKey from "./Model/Field/ForeignKey";
import Index from "./Table/Index";
import {ModelInterface, ModelStaticInterface} from "../JeloquentInterfaces";
import Collection from "./Collection";
import * as Str from "../Util/Str";
import * as Obj from "../Util/Obj";

class Model implements ModelInterface {

    private static kebabCaseName: string;

    private static snakeCaseName: string;

    _tmpId: string;

    ['constructor']: ModelStaticInterface;

    private _originalFields: Array<Field>;

    private _primaryFields: Array<Field>;

    private numberOfFields: number;

    constructor(fields: Array<Field> = []) {
        this.setFields(this.addRelationFields(fields));
        this._tmpId = `_${++globalThis.Store.numberOfModelCreated}`;
    }

    static get className() : string {
        return this.name;
    }

    static get kebabCaseClassName(): string {
        return this.kebabCaseName ??= Str.KebabCase(this.className);
    }

    static get snakeCaseClassName(): string {
        return this.snakeCaseName ??= Str.SnakeCase(this.className);
    }

    get className(): string {
        return this.constructor.className;
    }

    get dirtyFieldNames() {
        return this.dirtyFields.map(field => field.name);
    }

    get dirtyFields() {
        return this.originalFields.filter(field => field.isDirty);
    }

    get kebabCaseClassName(): string {
        return this.constructor.kebabCaseClassName;
    }

    get originalFields(): Array<Field> {
        return this._originalFields;
    }

    get originalPrimaryKey() {
        return this.primaryFields.reduce((toValue, field, i) => {
            if (i > 0) {
                return `${toValue}-${field.originalValue}`;
            }
            return field.originalValue;
        }, '') ?? this._tmpId ?? null;
    }

    get originalValues() {
        return this.originalFields.reduce((originalValues, field) => {
            if (field.originalValue !== undefined) {
                originalValues[field.name] = field.originalValue;
            }
            return originalValues;
        }, {});
    }

    get primaryFields():Array<Field> {
        return this._primaryFields ??= this.originalFields.filter(field => field.isPrimary);
    }

    get primaryKey(): string|number {
        return this.primaryFields.reduce((toValue:string, field:Field, i:number): string|number => {
            if (i > 0) {
                return `${toValue}-${field.value}`;
            }
            return field.value as (string|number);
        }, '') ?? this._tmpId ?? null;
    }

    get primaryKeyName(): Array<string> {
        return this.originalFields.filter(field => field.isPrimary).map(field => field.name);
    }

    get snakeCaseClassName(): string {
        return this.constructor.snakeCaseClassName;
    }

    static aSyncInsert(data): Promise<Collection> {
        return new Promise((resolve) => {
            queueMicrotask(() => {
                resolve(this.insert(data));
            });
        });
    }

    static aSyncUpdate(data): Promise<Collection> {
        return new Promise((resolve) => {
            queueMicrotask(() => {
                resolve(this.update(data));
            });
        });
    }

    static all(): Collection {
        return globalThis.Store.database().all(this.className);
    }

    static delete(id): void {
        globalThis.Store.database().delete(this.className, id);
    }

    static find(id) {
        return globalThis.Store.database().find(this.className, id);
    }

    static getIndexByKey(indexName) {
        return globalThis
            .Store
            .database()
            .getIndexByKey(this.className, indexName);
    }

    static getInstance(): ModelInterface {
        const original = globalThis.Store.classInstances[this.className] ?? (globalThis.Store.classInstances[this.className] = new this())
        const fieldsClone = original.originalFields.reduce((obj, field) => {
            obj.push(Object.assign(Object.create(Object.getPrototypeOf(field)), field));
            return obj;
        }, [])

        return Object.create(Object.getPrototypeOf(original)).setFields(fieldsClone);
    }

    static ids() {
        return globalThis
            .Store
            .database()
            .ids(this.className);
    }

    static insert(data: object|Array<object>): Collection {
        const modelsData = Array.isArray(data) ? data : [data];
        const length = modelsData.length;
        const models = new Collection();
        for (let i = 0; i < length; i++) {
            const modelData = modelsData[i];
            const model = this.getInstance();
            model.fill(modelData);
            globalThis.Store.database().insert(this.className, model);
            model.fillRelations(modelData);
            models.push(model);
        }
        return models;
    }

    static registerIndex(name: string): void {
        Index.register(this.getInstance(), name);
    }

    /**
     * @deprecated
     */
    static select(id) {
        try {
            return globalThis.Store.database().select(this.className, id);
        } catch (e) {
            console.error(e);
        }
    }

    static update(data: object|Array<object>): Collection {
        const modelsData = Array.isArray(data) ? data : [data];
        const length = modelsData.length;
        const models = new Collection();
        for (let i = 0; i < length; i++) {
            const model = this.getInstance();
            model.fill(data);
            globalThis.Store.database().update(this.className, model);
            model.fillRelations(data);
            models.push(model);
        }
        return models;
    }

    addRelationFields(fields) {
        const fieldList = [...fields];
        fields.forEach((field, i) => {
            if (field instanceof Relation) {
                fieldList.splice(i, 0, ...field.getRelationalFields());
            }
        });

        this.numberOfFields = fieldList.length;
        return fieldList;
    }

    delete() {
        this.constructor.delete(this.primaryKey);
    }

    fill(data) {
        for (let i = 0; i < this.numberOfFields; i++) {
            if (!(this.originalFields[i] instanceof Relation)) {
                const fieldName = this.originalFields[i].name;
                if (data[fieldName] !== undefined) {
                    this[`_${fieldName}`] = data[fieldName];
                }
            }
        }
    }

    fillRelations(data: object): void {
        // insert through relations after model insert;
        for (let i = 0; i < this.numberOfFields; i++) {
            if ((this.originalFields[i] instanceof Relation)) {
                const fieldName = this.originalFields[i].name;
                if (data[fieldName] !== undefined) {
                    this[`_${fieldName}`] = data[fieldName];
                }
            }
        }
    }

    isDirty(fieldName) {
        if (fieldName) {
            return this.dirtyFieldNames.includes(fieldName);
        }
        return this.dirtyFields.length > 0;
    }

    jsonStringify(): string {
        return JSON.stringify(this.toObject());
    }

    registerIndex(name) {
        Index.register(this, name);
    }

    resetDirty() {
        this.originalFields.filter((field) => !(field instanceof Relation)).forEach(field => {
            field.resetDirty();
        })
    }

    save() {
        const className = this.className;
        const currentDatabase = globalThis.Store.database();
        const tableIds = currentDatabase.ids(className);

        if (this.primaryKey[0] !== '_' && tableIds.includes(this._tmpId)) {
            //todo remove indexes for foreignKey
            //                                team_id  this.team_id
            Index.removeTmpIdFromIndex(this);
            currentDatabase.delete(className, this._tmpId);
        }

        if (tableIds.includes(this.primaryKey)) {
            currentDatabase.update(className, this);
            return;
        }
        currentDatabase.insert(className, this);
    }

    setFields(fields) {
        this._originalFields = [...fields];
        this.numberOfFields = this.originalFields.length;
        for (let i = 0; i < this.numberOfFields; i++) {
            this.originalFields[i].setup(this);
        }
        return this;
    }

    tableSetup(table) {
        for (let i = 0; i < this.numberOfFields; i++) {
            if (this.originalFields[i] instanceof ForeignKey) {
                this.originalFields[i].tableSetup(table);
            }

            if (this.originalFields[i] instanceof HasManyThrough) {
                this.originalFields[i].tableSetup(table);
            }
        }
    }

    toJSON(): object {
        return this.toObject();
    }

    toObject(fromRelation = false): object {
        return Obj.fromModel(this, fromRelation);
    }
}

export {
    Model,
    Field,
    Relation,
    BelongsTo,
    HasOne,
    HasOneThrough,
    HasMany,
    HasManyThrough,
    MorphOne,
    MorphTo,
    ForeignKey,
};