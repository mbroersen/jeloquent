import Relation from "../Relation";
import ForeignKey from "../Field/ForeignKey";

export default class MorphOne extends Relation {

    constructor(model) {
        super(model);
    }

    get originalValue() {
        return this.getValueByParentKey('originalPrimaryKey');
    }

    get value() {
        return this.getValueByParentKey('primaryKey');
    }

    getRelationalFields(): Array<ForeignKey> {
        return [];
    }

    private getValueByParentKey(parentProperty): unknown {
        const type = this.$parent.className;
        const id = this.$parent[parentProperty];
        const idKeyName = `${this.name}_id`;
        const idTypeName = `${this.name}_type`;

        const lookUpKey = {};
        lookUpKey[idKeyName] = id;
        lookUpKey[idTypeName] = type;

        return this.model.find(lookUpKey);
    }
}