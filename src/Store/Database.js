import Table from "./Table.js";

export default class Database {

    constructor(name, models) {
        this.name = name;

        /**
         *
         * @type {{<Table>}}
         */
        this.tables = {};

        models.forEach((model) => {
            const table = new Table(model);
            this.tables[table.name] = table;
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

    indexes(table) {
        return this.tables[table].indexes;
    }

    allModels(table) {
        return this.tables[table].allModels();
    }

    insertModel(table, model) {
        return this.tables[table].insertModel(model);
    }

    updateModel(table, model) {
        return this.tables[table].updateModel(model);
    }

    select(table, id) {
        return this.tables[table].select(id);
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