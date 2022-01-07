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

    private connections: Map<string, ConnectionInterface>;

    private databases: Map<string, DatabaseInterface>;

    private useConnectionName: string;

    private useDatabase: string;

    constructor() {
        this.classInstances = {};
        this.databases = new Map();
        this.connections = new Map();
        this.numberOfModelCreated = 0;
        this.useDatabase = 'default';
        this.useConnectionName = 'default';
        globalThis.Store = this;
    }

    add(database: DatabaseInterface): void {
        this.databases.set(database.name, database);
    }

    addConnection(connection: ConnectionInterface, name = 'default'): void {
        this.connections.set(name, connection);
    }

    connection(): ConnectionInterface|null {
        return this.connections.get(this.useConnectionName) ?? null;
    }

    database(): DatabaseInterface|null {
        return this.databases.get(this.useDatabase) ?? null;
    }

    use(storeName = 'default'): void {
        this.useDatabase = storeName;
        this.databases.get(this.useDatabase)?.setIndexes();
    }

    useConnection(name = 'default'): void {
        this.useConnectionName = name;
    }

    /**
     * @deprecated
     */
    useConnections(name:string): void {
        this.useConnection(name);
    }
}


export {
    Store,
    Database,
    Table,
    Connection,
    Index,
};