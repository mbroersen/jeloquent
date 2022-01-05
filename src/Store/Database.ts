
import {DatabaseInterface, ModelInterface} from "../JeloquentInterfaces";
import Collection from "./Collection";
import Table from "./Table";

export default class Database implements DatabaseInterface {

    _name: string;

    private _tables: Map<string, Table>;

    /**
     *
     * @param name
     * @param models
     */
    constructor(name, models:Array<ModelInterface>) {
        this._name = name;
        this._tables = new Map();

        models.forEach((model) => {
            const table = new Table(model);
            this._tables.set(table.name, table);
        });
    }

    get name(): string {
        return this._name;
    }

    register(model: ModelInterface) {
        const table = new Table(model);
        this._tables.set(table.name, table);
    }

    private table(name:string): Table {
        return this._tables.get(name);
    }

    setIndexes(): void {
        this._tables.forEach((table) => {
            table.setupIndexes();
        });
    }

    showTables(): IterableIterator<string> {
        return this._tables.keys();
    }

    // @ts-ignore
    ids(table): Array<string|number> {
        return this.table(table).ids;
    }

    all(table): Collection {
        return this.table(table).all();
    }

    allModels(table): Map<string|number, ModelInterface> {
        return this.table(table).allModels();
    }

    registerIndex(table: string, name: string): void {
        this.table(table).registerIndex(name);
    }

    addIndex(table:string, indexName:string, lookUpKey:string, id:string|number): void {
        this.table(table).addIndex(indexName, lookUpKey, id)
    }

    removeIndex(table: string, indexName: string, lookUpKey: string, id:string|number): void {
        this.table(table).removeIndex(indexName, lookUpKey, id);
    }

    getIndexByKey(table: string, indexName: string): Map<string|number, Set<string>> {
        // @ts-ignore
        return this.table(table).getIndexByKey(indexName);
    }

    indexes(table): Map<string, Map<string, Set<string>>>  {
        return this.table(table).indexes;
    }

    insert(table: string, model: ModelInterface) {
        return this.table(table).insert(model);
    }

    update(table: string, model: ModelInterface) {
        return this.table(table).update(model);
    }

    find(table:string, id:number|string): Collection<ModelInterface> {
        return this.table(table).find(id);
    }

    select(table: string, id:number|string) {
        return this.table(table).select(id);
    }

    delete(table:string, id:number|string) {
        return this.table(table).delete(id);
    }

    drop(table: string): void {
        this._tables.delete(table);
    }

    truncate(table: string): void {
        this.table(table).truncate();
    }

    /**
     * Todo Build better way of parsing queries;
     * @param sql
     * @returns {null|*}
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
}