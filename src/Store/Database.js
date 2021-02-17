import Table from "./Table.js";

export default class Database {

    /**
     *
     * @param name
     * @param models
     */
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

    /**
     *
     */
    setIndexes() {
        Object.values(this.tables).forEach((table) => {
            table.setupIndexes();
        });
    }

    /**
     *
     * @return {string[]}
     */
    showTables() {
        return Object.keys(this.tables);
    }

    /**
     *
     * @param table
     * @return {*[]|*}
     */
    ids(table) {
        return this.tables[table].ids();
    }

    /**
     *
     * @param table
     * @return {*}
     */
    all(table) {
        return this.tables[table].all();
    }

    /**
     *
     * @param table
     * @return {Map<*, *>|*}
     */
    allModels(table) {
        return this.tables[table].allModels();
    }

    /**
     *
     * @param table
     * @param name
     */
    registerIndex(table, name) {
        this.tables[table].registerIndex(name);
    }

    /**
     *
     * @param table
     * @param indexName
     * @param lookUpKey
     * @param id
     * @return {*|void}
     */
    addIndex(table, indexName, lookUpKey, id) {
        return this.tables[table].addIndex(indexName, lookUpKey, id)
    }

    /**
     *
     * @param table
     * @param indexName
     * @param lookUpKey
     * @param id
     * @return {void|*}
     */
    removeIndex(table, indexName, lookUpKey, id) {
        return this.tables[table].removeIndex(indexName, lookUpKey, id);
    }

    /**
     *
     * @param table
     * @param indexName
     * @return {*}
     */
    getIndexByKey(table, indexName) {
        return this.tables[table].getIndexByKey(indexName);
    }

    /**
     *
     * @param table
     * @param indexName
     * @param lookUpKey
     */
    unregisterLookUpKey(table, indexName, lookUpKey) {
        this.tables[table].unregisterLookUpKey(indexName, lookUpKey);
    }

    /**
     *
     * @param table
     * @return {any}
     */
    indexes(table) {
        return this.tables[table].indexes;
    }

    /**
     *
     * @param table
     * @param model
     * @return {*|*[]|void}
     */
    insert(table, model) {
        return this.tables[table].insert(model);
    }

    /**
     *
     * @param table
     * @param model
     * @return {*}
     */
    update(table, model) {
        return this.tables[table].update(model);
    }

    /**
     *
     * @param table
     * @param id
     * @return {*}
     */
    find(table, id) {
        return this.tables[table].find(id);
    }

    /**
     *
     * @param table
     * @param id
     * @return {*}
     */
    select(table, id) {
        return this.tables[table].select(id);
    }

    /**
     *
     * @param table
     * @param id
     * @return {*}
     */
    delete(table, id) {
        return this.tables[table].delete(id);
    }

    /**
     *
     * @param table
     */
    drop(table) {
        delete this.tables[table];
    }

    /**
     *
     * @param table
     * @return {*}
     */
    truncate(table) {
        return this.tables[table].truncate();
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