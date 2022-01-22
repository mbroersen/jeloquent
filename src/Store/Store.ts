import Database from "./Database";
import Table from "./Table";
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
        if (!this.databases.has(this.useDatabase)) {
            return null;
        }
        return new Proxy(this.databases.get(this.useDatabase), {
            construct(target, argArray, newTarget): object {
                return Reflect.construct(target, argArray, newTarget);
            },

            get(target: Database, p): unknown {
                if (!target[p]) {
                    return (...args) => {
                        const arrayArgs = [...args];
                        const tableName = arrayArgs.shift();
                        return target.table(tableName)[p](...arrayArgs);
                    }
                }
                return Reflect.get(target, p);
            }
        }) as DatabaseInterface;
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