import {Model} from "./Model";
import Collection from "./Collection";
import Index from "./Table/Index";
import {TableInterface, ModelInterface, ModelStaticInterface} from "../JeloquentInterfaces";

/**
 *
 */
export default class Table implements TableInterface {

    name: string;

    private _index: Index;

    private _model: ModelInterface;

    private _models: Map<string, ModelInterface>;

    private _primaryKeyFieldNames: Array<string>;

    constructor (model: ModelStaticInterface) {
        this.setup(model.getInstance());
    }

    get ids():string[] {
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
        this._index.addValue(indexName, lookUpKey, `${id}`);
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
        if (!this._models.has(`${id}`)) {
            throw new Error('Record doesn\'t exists');
        }

        this._index.removeValueByModel(this.findOne(id));

        this._models.delete(`${id}`);
    }

    public find(id:number|string|object|Array<string|number|object>): Collection|ModelInterface|null {
        const hasComposedPrimaryKey = this._primaryKeyFieldNames.length > 1;
        if (Array.isArray(id)) {
            if (hasComposedPrimaryKey) {
                return this.findCollectionComposedPrimaryKey(id as Array<object>);
            }
            return this.findCollection(id as Array<string|number>);
        }

        if (hasComposedPrimaryKey) {
            return this.findOneComposedPrimaryKey(id as object);
        }

        return this.findOne(id as (string|number));
    }

    public getIndexByKey(key: string): Map<string|number, Set<string|number>> {
        return this._index.getIndexByKey(key);
    }

    public insert(model: ModelInterface): void {
        if (!(model instanceof Model)) {
            throw new Error('Record should be instance of model');
        }

        if (this._models.has(model.primaryKey)) {
            return;
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

    public save(model: ModelInterface) {
        if (!model.primaryKey.startsWith('_') && this.ids.includes(model._tmpId)) {
            //todo remove indexes for foreignKey
            //                                team_id  this.team_id
            Index.removeTmpIdFromIndex(model);
            this.delete(model._tmpId);
        }

        if (this.ids.includes(model.primaryKey)) {
            this.update(model);
            return;
        }
        this.insert(model);
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

    private findCollection(id:Array<string|number>): Collection {
        const result = [];
        for (let i = 0; i < id.length; i++) {
            result.push(
                this._models.get(`${id[i]}`)
            );
        }
        return new Collection(...result);
    }

    private findCollectionComposedPrimaryKey(id: Array<object>): Collection {
        const result = [];
        for (let i = 0; i < id.length; i++) {
            result.push(
                this._models.get(
                    this.toComposedKey(id[i])
                )
            );
        }
        return new Collection(...result);
    }

    private findOne(id: string|number): ModelInterface|null {
        return this._models.get(`${id}`) ?? null;
    }

    private findOneComposedPrimaryKey(id: object|string): ModelInterface|null {
        return this._models.get(this.toComposedKey(id)) ?? null;
    }

    private setup(model: ModelInterface) {
        this.name = model.className;
        this._primaryKeyFieldNames = model.primaryKeyName;

        this._model = model;
        this._models = new Map();
        this._index = new Index();
    }

    private toComposedKey(id:string|object): string|null {
        if (typeof id === 'string') {
            return id;
        }

        if (id === null) {
            return null;
        }

        const key = [];
        for (let i = 0; i < this._primaryKeyFieldNames.length; i++) {
            key.push(id[this._primaryKeyFieldNames[i]] ?? '');
        }

        return key.join('-');
    }
}