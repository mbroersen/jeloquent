import Relation from "../Relation";

/**
 *
 */
export default class MorphOne extends Relation {

    /**
     *
     * @param {Model} model
     */
    constructor(model) {
        super(model);
    }

    /**
     *
     * @return {Model|null}
     */
    get value() {
        const type = this.$parent.className;
        const id = this.$parent.primaryKey;
        const idKeyName = `${this.$name}_id`;
        const idTypeName = `${this.$name}_type`;

        const lookUpKey = {};
        lookUpKey[idKeyName] = id;
        lookUpKey[idTypeName] = type;

        return this.model.find(lookUpKey);
    }

    /**
     *
     * @return {Model|null}
     */
    get originalValue() {
        const type = this.$parent.className;
        const id = this.$parent.originalPrimaryKey;
        const idKeyName = `${this.$name}_id`;
        const idTypeName = `${this.$name}_type`;

        const lookUpKey = {};
        lookUpKey[idKeyName] = id;
        lookUpKey[idTypeName] = type;

        return this.model.find(lookUpKey);
    }


    /**
     *
     * @return {*[]}
     */
    getRelationalFields() {
        return [];
    }
}