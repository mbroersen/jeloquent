import Relation from "../Relation.js";
import {ModelStaticInterface} from "../../../JeloquentInterfaces";
import Collection from "../../Collection";

/**
 *
 */
export default class HasManyThrough extends Relation {

    localKey: string;

    throughModel: ModelStaticInterface;

    private _lcModelClassName: string;

    private _lcParentClassName: string;

    private _lcThroughModelClassName: string;

    constructor(model: ModelStaticInterface, throughModel: ModelStaticInterface, foreignKey: string, localKey: string) {
        super(model, foreignKey);
        this.model = model;
        this.throughModel = throughModel;
        this.localKey = localKey ?? 'id';
    }

    get indexName(): string {
        return `${this._lcThroughModelClassName}.${this._lcParentClassName}_id`;
    }

    get originalValue(): Collection {
        return this.getValueByParentKey('originalPrimaryKey');
    }

    get value(): Collection {
        return this.getValueByParentKey('primaryKey');
    }

    getRelationalFields():Array<unknown> {
        return [];
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

    tableSetup() {
        this.model.registerIndex(this.indexName);
    }

    private getValueByParentKey(parentProperty: string): Collection {
        const keyIndex = this.model.getIndexByKey(this.indexName);

        return globalThis.Store.database().find(this.model.className,
            [...(keyIndex.get(this.$parent[parentProperty])?.values()) ?? []]
        );
    }
}