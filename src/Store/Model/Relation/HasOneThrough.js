import Relation from "../Relation";

export default class HasOneThrough extends Relation {

    /**
     *
     * @param {Model} model
     * @param {Model} throughModel
     * @param {string} foreignKey
     * @param {string} localKey
     */
    constructor(model, throughModel, foreignKey, localKey) {
        super(model, foreignKey);
        this.throughModel = throughModel;
        this.localKey = localKey ?? 'id';
    }

    get indexName() {
        return `${this._lcThroughModelClassName}.${this._lcParentClassName}_id`;
    }

    get originalValue() {
        const findModel = this.$parent[`original_${this._lcThroughModelClassName}`];
        return findModel[`original_${this._lcModelClassName}`] ?? null;
    }

    get value() {
        const findModel = this.$parent[this._lcThroughModelClassName];
        return findModel[this._lcModelClassName] ?? null;
    }

    getRelationalFields() {
        return [];
    }

    setName() {
        this._lcThroughModelClassName = this.throughModel.snakeCaseClassName;
        this._lcModelClassName = this.model.snakeCaseClassName;
        this._lcParentClassName = this.$parent.snakeCaseClassName;
        this.foreignKey = `${this._lcThroughModelClassName}_id`;
        this.$name = `${this._lcModelClassName}`;
        return this;
    }
}