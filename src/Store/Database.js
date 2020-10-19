import Table from "./Table.js";
import HasManyThrough from "./Model/Relation/HasManyThrough.js";

export default class Database {

    constructor(name, models) {
        this.name = name;

        /**
         *
         * @type {{<Table>}}
         */
        this.tables = {};
        this.hasManyThroughRelations = [];

        models.forEach((model) => {
            const table = new Table(model);
            this.tables[table.name] = table;

            this.hasManyThroughRelations.push(...model.getInstance().originalFields.filter(field => field instanceof HasManyThrough));
        });

        this.hasManyThroughRelations.forEach((hasManyThrough) => {
            this.addIndex(hasManyThrough.model.className(), hasManyThrough.indexName);
        });
    }

    showTables() {
        return Object.keys(this.tables);
    }

    ids(table) {
        return this.tables[table].ids();
    }

    all(table) {
        return this.tables[table].all();
    }

    allModels(table) {
        return this.tables[table].allModels();
    }

    addIndex(table, name) {
        this.tables[table]?.addIndex(name);
    }

    removeFromIndex(table, indexName, lookUpKey, id) {
        return this.tables[table].removeFromIndex(indexName, lookUpKey, id);
    }

    indexes(table) {
        return this.tables[table].indexes;
    }

    insert(table, model) {
        return this.tables[table].insert(model);
    }

    update(table, model) {
        return this.tables[table].update(model);
    }

    find(table, id) {
        return this.tables[table].find(id);
    }

    select(table, id) {
        return this.tables[table].select(id);
    }

    delete(table, id) {
        return this.tables[table].delete(id);
    }

    drop(table) {
        delete this.tables[table];
    }

    truncate(table) {
        return this.tables[table].truncate();
    }

    /**
     * Todo Build better way of parsing queries;
     * @param sql
     * @returns {null|*}
     */
    query(sql) {
        const sqlParts = sql.match(/^((SELECT)|(INSERT)|(DELETE))\s+(.*)\s+FROM\s+([^\s]+)(\s+WHERE\s+([^\s]+)\s+(\=)\s+([^\s+]))?((\s+)|;)?$/i);

        if (sqlParts.length === 0) {
            return null;
        }

        const action = sqlParts[1];
        const fields = sqlParts[5].split(',');
        const table = sqlParts[6]
        const matchField = sqlParts[8];
        const matchValue = sqlParts[10];

        if (matchField === 'id' ) {
            return this[action.toLowerCase()](table, matchValue);
        }

        if (matchField === undefined && action === 'SELECT') {
            return this.all(table);
        }

        return null;

    }


}