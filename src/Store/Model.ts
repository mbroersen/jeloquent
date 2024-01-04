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
import * as ModelSetup from "./Model/Util/Setup";
import Table from "./Table";

class Model implements ModelInterface {

    private static kebabCaseName: string;

    private static snakeCaseName: string;

    _tmpId: string;

    ['constructor']: ModelStaticInterface;

    private _originalFields: Map<string, Field>;

    private _primaryFields: Field[];

    private numberOfFields: number;

    constructor(fields: Field[] = []) {
        this.setFields(ModelSetup.addRelationFieldsToList(fields));
        this._tmpId = `_${++globalThis.Store.numberOfModelCreated}`;

        return ModelSetup.modelProxy(this);
    }

    static get className(): string {
        return this.name;
    }

    static get kebabCaseClassName(): string {
        return this.kebabCaseName ??= Str.KebabCase(this.className);
    }

    static get snakeCaseClassName(): string {
        return this.snakeCaseName ??= Str.SnakeCase(this.className);
    }

    get className(): string {
        return Object.getPrototypeOf(this).constructor.className;
    }

    get dirtyFieldNames(): string[] {
        return this.dirtyFields.map(field => field.name);
    }

    get dirtyFields(): Field[] {
        return this.originalFields.filter(field => field.isDirty);
    }

    get kebabCaseClassName(): string {
        return  Object.getPrototypeOf(this).constructor.kebabCaseClassName;
    }

    get originalFields(): Field[] {
        return [...this._originalFields.values()];
    }

    get originalPrimaryKey(): unknown {
        return this.primaryFields.reduce((toValue, field, i) => {
            if (i > 0) {
                return `${toValue}-${field.originalValue}`;
            }
            return field.originalValue;
        }, '') ?? this._tmpId ?? null;
    }

    get originalValues(): object {
        return this.originalFields.reduce((originalValues, field) => {
            if (field.originalValue !== undefined) {
                originalValues[field.name] = field.originalValue;
            }
            return originalValues;
        }, {});
    }

    get primaryFields(): Field[] {
        return this._primaryFields ??= this.originalFields.filter(field => field.isPrimary);
    }

    get primaryKey(): string {
        return (this.primaryFields.reduce((toValue:string, field:Field, i:number): string => {
            if (i > 0) {
                return `${toValue}-${field.value}`;
            }

            if (field.value === null) {
                return field.value;
            }

            return `${field.value}`;
        }, '') ?? this._tmpId ?? null);
    }


    get primaryKeyName(): string[] {
        return this.originalFields.filter(field => field.isPrimary).map(field => field.name);
    }



    get snakeCaseClassName(): string {
        return Object.getPrototypeOf(this).constructor.snakeCaseClassName;
    }

    static aSyncInsert(data: object): Promise<Collection> {
        return new Promise((resolve) => {
            queueMicrotask(() => {
                resolve(this.insert(data));
            });
        });
    }

    static aSyncUpdate(data: object): Promise<Collection> {
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

    static find(id): unknown {
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

        return ModelSetup.modelProxy(Object.create(Object.getPrototypeOf(original)).setFields(fieldsClone));
    }

    static ids() {
        return globalThis
            .Store
            .database()
            .ids(this.className);
    }

    static insert(data: object|object[]): Collection {
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

    static update(data: object|object[]): Collection {
        const modelsData = Array.isArray(data) ? data : [data];
        const length = modelsData.length;
        const models = new Collection();
        for (let i = 0; i < length; i++) {
            const model = this.find(this.getInstance().primaryKeyByValues(data));
            model.fill(data);
            globalThis.Store.database().update(this.className, model);
            model.fillRelations(data);
            models.push(model);
        }
        return models;
    }

    delete() {
        Object.getPrototypeOf(this).constructor.delete(this.primaryKey);
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

    isDirty(fieldName:string = null) {
        if (fieldName) {
            return this.dirtyFieldNames.includes(fieldName);
        }
        return this.dirtyFields.length > 0;
    }

    primaryKeyByValues(values): string
    {
        return this.primaryFields.reduce((toValue, field:Field, i) => {
            if (i > 0) {
                return `${toValue}-${values[field.name]}`
            }
            return `${values[field.name]}`;
        }, '');
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
        globalThis.Store.database().save(this.className, this);
    }

    setFields(fields: Field[]) {
        this._originalFields = new Map();
        ModelSetup.setFields(this, fields);
        return this;
    }

    tableSetup(table: Table) {
        ModelSetup.setupTable(this, table);
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