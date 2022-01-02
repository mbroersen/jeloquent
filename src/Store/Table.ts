import {Model} from "./Model.js";
import Collection from "./Collection.js";
import Index from "./Table/Index";
import {TableInterface, ModelInterface, IndexInterface} from "../JeloquentInterfaces";

/**
 *
 */
export default class Table implements TableInterface {

    model: ModelInterface;
    name: string;
    index: IndexInterface;
    primaryKeyFieldNames: Array<string>;
    models: Map<string, ModelInterface>;

    constructor(model: ModelInterface) {
        this.setup(model.getInstance());
    }

    private setup(model: ModelInterface) {
        this.model = model;
        this.name = model.className;
        this.models = new Map();
        this.index = new Index();
        this.primaryKeyFieldNames = model.primaryKeyName;
    }

    public setupIndexes(): void {
        this.model.tableSetup(this);
    }

    public registerIndex(indexName:string): void {
        this.index.registerIndex(indexName);
    }

    public addIndex(indexName:string, lookUpKey:string, id:string): void {
        this.index.addValue(indexName, lookUpKey, id);
    }

    public removeIndex(indexName:string, lookUpKey:string, id:string): void {
        this.index.removeValue(indexName, lookUpKey, id)
    }

    public getIndexByKey(key): string {
        return this.index.getIndexByKey(key);
    }

    get indexes (): Map<string, Map<string, Map<number, Set<string>>>> {
        return this.index.indexes;
    }

    public allModels(): Map<string, ModelInterface> {
        return this.models;
    }

    public ids():Array<string> {
        return [...this.models.keys()];
    }

    public all(): Collection {
        const values = [...this.models.values()];
        const numberOfValues = values.length;
        const collection = new Collection();
        for (let i = 0; i < numberOfValues; i += 10000) {
            collection.push(...values.slice(i, i + 10000));
        }

        return collection;
    }

    public insert(model: Model): void {
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

        this.index.addValueByModel(model);
    }

    /**
     *
     * @param model
     */
    public update(model): void {
        if (!this.models.has(model.primaryKey)) {
            throw new Error('Record doesn\'t exists');
        }

        if (!(model instanceof Model)) {
            throw new Error('Record should be instance of model');
        }

        this.index.removeValueByModel(model);

        model.resetDirty();

        this.index.addValueByModel(model);

        this.models.set(model.primaryKey, model);
    }

    public delete(id:string): void {
        if (!this.models.has(id)) {
            throw new Error('Record doesn\'t exists');
        }

        this.index.removeValueByModel(this.find(id));

        this.models.delete(id);
    }

    public truncate(): void {
        this.models.clear();
        this.index.truncate();
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

    public find(id:number|string|Array<string|number>):Collection|Model|null {
        const hasComposedPrimaryKey = this.primaryKeyFieldNames.length > 1;
        if (Array.isArray(id)) {
            const result = [];
            let pushFunction = hasComposedPrimaryKey ? (i:number) => {
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

    public select(id:string): Collection {
        if (!this.models.has(id)) {
            throw new Error('Record doesn\'t exists');
        }

        return this.find(id);
    }
}