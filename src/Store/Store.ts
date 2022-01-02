import Database from "./Database.js";
import Table from "./Table.js";
import Connection from "./Connection";
import Index from "./Table/Index";
import {ConnectionInterface, DatabaseInterface, StoreInterface} from "../JeloquentInterfaces";

/**
 *
 */
class Store implements StoreInterface {

    classInstances: object;
    numberOfModelCreated: number;

    private useDatabase: string;
    private useConnectionName: string;
    private connections: Map<string, ConnectionInterface>;
    private databases: Map<string, DatabaseInterface>;

    constructor() {
        this.classInstances = {};
        this.databases = new Map();
        this.connections = new Map();
        this.numberOfModelCreated = 0;
        this.useDatabase = 'default';
        this.useConnectionName = 'default';
        globalThis.Store = this;
    }

    use(storeName: string = 'default'): void {
        this.useDatabase = storeName;
        this.databases.get(this.useDatabase)?.setIndexes();
    }

    add(database: DatabaseInterface): void {
        this.databases.set(database.name, database);
    }

    addConnection(connection: ConnectionInterface, name: string = 'default'): void {
        this.connections.set('default', connection);
    }

    /**
     *
     * @deprecated
     */
    useConnections(name:string): void {
        this.useConnection(name);
    }

    useConnection(name:string = 'default'): void {
        this.useConnectionName = name;
    }

    database(): Database|null {
        return this.databases.get(this.useDatabase) ?? null;
    }

    connection(): Connection|null {
        return this.connections.get(this.useConnectionName) ?? null;
    }
}


export {
    Store,
    Database,
    Table,
    Connection,
    Index,
};