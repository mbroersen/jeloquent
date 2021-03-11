import Database from "./Database.js";
import Table from "./Table.js";
import Connection from "./Connection";
import Index from "./Table/Index";

/**
 *
 */
class Store {

    /**
     *
     */
    constructor() {
        this.classInstances = {};
        this.databases = {};
        this.connetions = {}
        this.numberOfModelCreated = 0;
        this.useDatabase = 'default';
        this.useConnection = 'default';
        globalThis.Store = this;
    }

    /**
     *
     * @param storeName
     */
    use(storeName) {
        this.useDatabase = storeName;
        this.databases[this.useDatabase ?? 'default']?.setIndexes();
    }

    /**
     *
     * @param database
     */
    add(database) {
        this.databases[database.name] = database;
    }

    /**
     *
     * @param connection
     * @param name
     */
    addConnections(connection, name) {
        this.connetions[name ?? 'default'] = connection;
    }

    /**
     *
     * @param name
     */
    useConnection(name) {
        this.useConnection = name ?? 'default';
    }

    /**
     *
     * @return {Database|null}
     */
    database() {
        return this.databases[this.useDatabase] ?? null;
    }

    /**
     *
     * @return {Connection}
     */
    connection() {
        return this.connetions[this.useConnection];
    }
}


export {
    Store,
    Database,
    Table,
    Connection,
    Index,
};