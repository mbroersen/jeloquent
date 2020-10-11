
import Relation from "../Relation";


//should return avatar
export default class MorphOne extends Relation {

    constructor(model) {
        super(model);
    }

    getRelationalFields() {
        return [];
    }

    get value() {
        const type = this.$parent.constructor.className();
        const id = this.$parent.primaryKey;
        const idKeyName = `${this.$name}_id`;
        const idTypeName = `${this.$name}_type`;

        const lookUpKey = {};
        lookUpKey[idKeyName] = id;
        lookUpKey[idTypeName] = type;

        return this.model.find(lookUpKey);
    }
}