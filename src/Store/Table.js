import {Model} from "./Model.js";

export default class Table {

    constructor(model) {
        this.setup(model.getInstance());
    }

    setup(model) {
        //todo setup by model;
        this.indexedFields = model.indexedFields;
        this.name = model.constructor.className();
        this.models = {};
        this.indexes = {};

        this.indexedFields.forEach((indexedField) => {
            this.indexes[indexedField] = {};
        });
    }

    ids() {
        return Object.keys(this.models);
    }

    all() {
        return Object.values(this.models);
    }

    insert(model) {
        if (this.models.hasOwnProperty(model.primaryKey)) {
            throw new Error('Record already exists');
        }

        if (!(model instanceof Model)) {
            throw new Error('Record should be instance of model');
        }

        this.indexedFields.forEach((fieldName) => {
            const indexes = this.indexes[fieldName][model[fieldName]] ?? [];
            indexes.push(model.primaryKey);
            this.indexes[fieldName][model[fieldName]] = indexes;
        })

        this.models[model.primaryKey] = model;
    }

    update(model) {
        if (!this.models.hasOwnProperty(model.primaryKey)) {
            throw new Error('Record doesn\'t exists');
        }

        if (!(model instanceof Model)) {
            throw new Error('Record should be instance of model');
        }

        this.models[model.primaryKey] = model;
    }

    select(id) {
        if (!this.models.hasOwnProperty(id)) {
            throw new Error('Record doesn\'t exists');
        }

        return this.models[id];
    }

    delete(id) {
        if (!this.models.hasOwnProperty(id)) {
            throw new Error('Record doesn\'t exists');
        }
        //todo remove from indexes;

        delete this.models[id];
    }

    selectModelsByIndex(key) {
        // todo HasMany.js -> get value(value)

        // if (Store.database().indexes(this.model.className()).hasOwnProperty(this.foreignKey)) {
        //     return Store.database().indexes(this.model.className())[this.foreignKey][this.$parent[this.localKey]].reduce((obj, key) => {
        //         obj.push(Store.database().selectModel(this.model.className(), key));
        //         return obj;
        //     }, []);
        // }
    }
}