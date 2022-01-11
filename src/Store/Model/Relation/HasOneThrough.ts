import Relation from "../Relation";
import {ModelStaticInterface} from "../../../JeloquentInterfaces";
import ForeignKey from "../Field/ForeignKey";

export default class HasOneThrough extends Relation {

    localKey: string;

    throughModel: ModelStaticInterface;

    private _lcModelClassName: string;

    private _lcParentClassName: string;

    private _lcThroughModelClassName: string;

    constructor(model: ModelStaticInterface, throughModel: ModelStaticInterface, foreignKey: string, localKey = 'id') {
        super(model, foreignKey);
        this.throughModel = throughModel;
        this.localKey = localKey;
    }

    get indexName(): string {
        return `${this._lcThroughModelClassName}.${this._lcParentClassName}_id`;
    }

    get originalValue(): unknown {
        const findModel = this.$parent[`original_${this._lcThroughModelClassName}`];
        return findModel[`original_${this._lcModelClassName}`] ?? null;
    }

    get value(): unknown {
        const findModel = this.$parent[this._lcThroughModelClassName];
        return findModel[this._lcModelClassName] ?? null;
    }

    getRelationalFields(): Array<ForeignKey> {
        return [];
    }

    setName(): HasOneThrough {
        this._lcThroughModelClassName = this.throughModel.snakeCaseClassName;
        this._lcModelClassName = this.model.snakeCaseClassName;
        this._lcParentClassName = this.$parent.snakeCaseClassName;
        this.foreignKey = `${this._lcThroughModelClassName}_id`;
        this.$name = `${this._lcModelClassName}`;
        return this;
    }
}