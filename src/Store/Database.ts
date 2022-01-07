
import {DatabaseInterface, ModelInterface, ModelStaticInterface} from "../JeloquentInterfaces";
import Collection from "./Collection";
import Table from "./Table";

export default class Database implements DatabaseInterface {

    private _name: string;

    private _tables: Map<string, Table>;

    /**
     *
     * @param name
     * @param models
     */
    constructor(name, models:Array<ModelStaticInterface>) {
        this._name = name;
        this._tables = new Map();

        models.forEach((model: ModelStaticInterface) => {
            this.register(model);
        });
    }

    get name(): string {
        return this._name;
    }

    addIndex(table:string, indexName:string, lookUpKey:string, id:string|number): void {
        this.table(table).addIndex(indexName, lookUpKey, id)
    }

    all(table): Collection {
        return this.table(table).all();
    }

    allModels(table): Map<string|number, ModelInterface> {
        return this.table(table).allModels();
    }

    delete(table:string, id:number|string): void {
        this.table(table).delete(id);
    }

    drop(table: string): void {
        this._tables.delete(table);
    }

    find(table:string, id:number|string|Array<string|number>): Collection<ModelInterface>|ModelInterface|null {
        return this.table(table).find(id);
    }

    getIndexByKey(table: string, indexName: string): Map<string|number, Set<string|number>> {
        return this.table(table).getIndexByKey(indexName);
    }

    ids(table: string): Array<string|number> {
        return this.table(table).ids;
    }

    indexes(table: string): Map<string, Map<string|number, Set<string|number>>>  {
        return this.table(table).indexes;
    }

    insert(table: string, model: ModelInterface): void {
        this.table(table).insert(model);
    }

    /**
     * @todo Build better way of parsing queries;
     */
    query(sql) {
        const sqlParts = sql.match(/^((SELECT)|(INSERT)|(DELETE))\s+(.*)\s+FROM\s+([^\s]+)(\s+WHERE\s+([^\s]+)\s+(=)\s+([^\s+]))?((\s+)|;)?$/i);

        if (sqlParts.length === 0) {
            return null;
        }

        const action = sqlParts[1];
        //const fields = sqlParts[5].split(',');
        const table = sqlParts[6]
        const matchField = sqlParts[8];
        const matchValue = sqlParts[10];

        if (matchField === 'id') {
            return this[action.toLowerCase()](table, matchValue);
        }

        if (matchField === undefined && action === 'SELECT') {
            return this.all(table);
        }

        return null;
    }

    register(model: ModelStaticInterface) {
        const table = new Table(model);
        this._tables.set(table.name, table);
    }

    registerIndex(table: string, name: string): void {
        this.table(table).registerIndex(name);
    }

    removeIndex(table: string, indexName: string, lookUpKey: string, id:string|number): void {
        this.table(table).removeIndex(indexName, lookUpKey, id);
    }

    select(table: string, id:number|string): ModelInterface {
        return this.table(table).select(id);
    }

    setIndexes(): void {
        this._tables.forEach((table) => {
            table.setupIndexes();
        });
    }

    showTables(): Array<string> {
        return [...this._tables.keys()];
    }

    truncate(table: string): void {
        this.table(table).truncate();
    }

    update(table: string, model: ModelInterface): void {
        this.table(table).update(model);
    }

    private table(name:string): Table {
        return this._tables.get(name);
    }
}