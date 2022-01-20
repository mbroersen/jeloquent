import {ModelInterface, ModelStaticInterface} from "../JeloquentInterfaces";
import Table from "./Table";

export default class Database {

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

    allModels(table): Map<string|number, ModelInterface> {
        return this.table(table).allModels();
    }

    drop(table: string): void {
        this._tables.delete(table);
    }

    ids(table: string): Array<string|number> {
        return this.table(table).ids;
    }

    indexes(table: string): Map<string, Map<string|number, Set<string|number>>>  {
        return this.table(table).indexes;
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
            return this.table(table)[action.toLowerCase()](matchValue);
        }

        if (matchField === undefined && action === 'SELECT') {
            return this.table(table).all();
        }

        return null;
    }

    register(model: ModelStaticInterface) {
        const table = new Table(model);
        this._tables.set(table.name, table);
    }

    setIndexes(): void {
        this._tables.forEach((table) => {
            table.setupIndexes();
        });
    }

    showTables(): Array<string> {
        return [...this._tables.keys()];
    }

    table(name:string): Table {
        return this._tables.get(name);
    }
}