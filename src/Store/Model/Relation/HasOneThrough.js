import Relation from "../Relation";

export default class HasOneThrough extends Relation {

    constructor(model, throughModel, foreignKey, localKey) {
        super(model, foreignKey);
        this.throughModel = throughModel;
        this.localKey = localKey ?? 'id';
    }

    setName() {
        this._lcThroughModelClassName = this.throughModel.snakeCaseClassName();
        this._lcModelClassName = this.model.snakeCaseClassName();
        this._lcParentClassName = this.$parent.constructor.snakeCaseClassName();
        this.foreignKey = `${this._lcThroughModelClassName}_id`;
        this.$name = `${this._lcModelClassName}`;
        return this;
    }

    get indexName() {
        return `${this._lcThroughModelClassName}.${this._lcParentClassName}_id`;
    }

    getRelationalFields() {
        return [];
    }

    get value() {
        const findModel = this.$parent[this._lcThroughModelClassName];
        return findModel[this._lcModelClassName] ?? null;
    }
}