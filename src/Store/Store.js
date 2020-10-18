import Database from "./Database.js";
import Table from "./Table.js";
import Connection from "./Connection";

class Store {
    constructor() {
        this.classInstances = {};
        this.databases = {};
        this.connetions = {}
        this.numberOfModelCreated = 0;
        this.useDatabase = 'default';
        this.useConnection = 'default';
        window.Store = this;
    }

    use(storeName) {
        this.useDatabase = storeName;
    }

    add(database) {
        this.databases[database.name] = database;
    }

    addConnections(connection, name) {
        this.connetions[name ?? 'default'] = connection;
    }

    useConnection(name) {
        this.useConnection = name ?? 'default';
    }

    database() {
        return this.databases[this.useDatabase] ?? null;
    }

    connection() {
        return this.connetions[this.useConnection];
    }
}


export {
    Store,
    Database,
    Table,
    Connection,
};