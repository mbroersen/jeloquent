import Relation from "../Relation.js";

/**
 *
 */
export default class HasManyThrough extends Relation {

    /**
     *
     * @param {Model} model
     * @param {Model} throughModel
     * @param {string} foreignKey
     * @param {string} localKey
     */
    constructor(model, throughModel, foreignKey, localKey) {
        super(model, foreignKey);
        this.model = model;
        this.throughModel = throughModel;
        this.localKey = localKey ?? 'id';
    }

    /**
     *
     * @return {string}
     */
    get indexName() {
        return `${this._lcThroughModelClassName}.${this._lcParentClassName}_id`;
    }

    /**
     *
     * @return {Collection}
     */
    get value() {
        return this.getValueByParentKey('primaryKey');
    }

    /**
     *
     * @return {Collection}
     */
    get originalValue() {
        return this.getValueByParentKey('originalPrimaryKey');
    }

    /**
     *
     * @param {string} parentProperty
     * @return {Collection}
     */
    getValueByParentKey(parentProperty) {
        const keyIndex = this.model.getIndexByKey(this.indexName);

        return globalThis.Store.database().find(this.model.className,
            [...(keyIndex.get(this.$parent.originalPrimaryKey)?.values()) ?? []]
        );
    }

    /**
     *
     * @return {HasManyThrough}
     */
    setName() {
        this._lcThroughModelClassName = this.throughModel.snakeCaseClassName;
        this._lcModelClassName = this.model.snakeCaseClassName;
        this._lcParentClassName = this.$parent.snakeCaseClassName;
        this.foreignKey = `${this._lcThroughModelClassName}_id`;
        this.$name = `${this._lcModelClassName}s`;
        return this;
    }

    /**
     *
     */
    tableSetup() {
        this.model.registerIndex(this.indexName);
    }

    /**
     *
     * @return {array}
     */
    getRelationalFields() {
        return [];
    }
}