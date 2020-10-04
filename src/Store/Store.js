import Database from "./Database.js";
import Table from "./Table.js";

class Store {
    constructor() {
        this.classInstances = {};
        this.databases = {};
        this.numberOfModelCreated = 0;
        window.Store = this;
    }

    use(storeName) {
        this.use = storeName;
    }

    add(database) {
        this.databases[database.name] = database;
    }

    database() {
        return this.databases[this.use];
    }
}


export {
    Store,
    Database,
    Table,
};