import {Model} from "./Model.js";
import Collection from "./Collection.js";
import Index from "./Table/Index";
import {TableInterface, ModelInterface, ModelStaticInterface} from "../JeloquentInterfaces";

/**
 *
 */
export default class Table implements TableInterface {

    name: string;

    primaryKeyFieldNames: Array<string>;

    private _index: Index;

    private _model: ModelInterface;

    private _models: Map<string|number, ModelInterface>;

    constructor (model: ModelStaticInterface) {
        this.setup(model.getInstance());
    }

    get ids():Array<string|number> {
        return [...this._models.keys()];
    }

    get indexes(): Map<string, Map<string|number, Set<string|number>>> {
        return this._index.indexes;
    }

    get models(): Map<string|number, ModelInterface> {
        return this._models;
    }

    static make(model: ModelStaticInterface): Table {
        return new Table(model);
    }

    public addIndex(indexName:string, lookUpKey:string, id:string|number): void {
        this._index.addValue(indexName, lookUpKey, id);
    }

    public all(): Collection {
        const values = [...this._models.values()];
        const numberOfValues = values.length;
        const collection = new Collection();
        for (let i = 0; i < numberOfValues; i += 10000) {
            collection.push(...values.slice(i, i + 10000));
        }

        return collection;
    }

    /**
     * @deprecated
     */
    public allModels(): Map<string | number, ModelInterface> {
        return this.models;
    }

    public delete(id:string|number): void {
        if (!this._models.has(id)) {
            throw new Error('Record doesn\'t exists');
        }

        this._index.removeValueByModel(this.find(id));

        this._models.delete(id);
    }

    public find(id:number|string|Array<string|number>): Collection<ModelInterface>|ModelInterface|null {
        const hasComposedPrimaryKey = this.primaryKeyFieldNames.length > 1;
        if (Array.isArray(id)) {
            const result = [];
            const pushFunction = hasComposedPrimaryKey ? (i:number) => {
                result.push(this._models.get(this.getKey(id[i])) ?? null);
            } : (i) => {
                result.push(this._models.get(id[i]) ?? null);
            }

            for (let i = 0; i < id.length; i++) {
                pushFunction(i);
            }

            return new Collection(...result);
        }

        if (hasComposedPrimaryKey) {
            return this._models.get(this.getKey(id)) ?? null;
        }

        return this._models.get(id) ?? null;
    }

    public getIndexByKey(key: string): Map<string|number, Set<string|number>> {
        return this._index.getIndexByKey(key);
    }

    public getKey(id:number|string|Array<string|number>): string|null {
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

    public insert(model: ModelInterface): void {
        if (this._models.has(model.primaryKey)) {
            throw new Error('Record already exists');
        }

        if (!(model instanceof Model)) {
            throw new Error('Record should be instance of model');
        }

        model.resetDirty();

        if (model.primaryKey != null) {
            this._models.set(model.primaryKey, model);
        }

        this._index.addValueByModel(model);
    }

    public registerIndex(indexName:string): void {
        this._index.register(indexName);
    }

    public removeIndex(indexName:string, lookUpKey:string, id:string|number): void {
        this._index.removeValue(indexName, lookUpKey, id)
    }

    public select(id:string|number): Collection<ModelInterface>|ModelInterface|null {
        if (!this._models.has(id)) {
            throw new Error('Record doesn\'t exists');
        }

        return this.find(id);
    }

    public setupIndexes(): void {
        this._model.tableSetup(this);
    }

    public truncate(): void {
        this._models.clear();
        this._index.truncate();
    }

    public update(model: ModelInterface): void {
        if (!this.models.has(model.primaryKey)) {
            throw new Error('Record doesn\'t exists');
        }

        if (!(model instanceof Model)) {
            throw new Error('Record should be instance of model');
        }

        this._index.removeValueByModel(model);

        model.resetDirty();

        this._index.addValueByModel(model);

        this._models.set(model.primaryKey, model);
    }

    private setup(model: ModelInterface) {
        this.name = model.className;
        this.primaryKeyFieldNames = model.primaryKeyName;

        this._model = model;
        this._models = new Map();
        this._index = new Index();
    }
}