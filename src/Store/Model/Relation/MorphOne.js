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
        return this.getValueByParentKey('primaryKey');
    }

    /**
     *
     * @return {Model|null}
     */
    get originalValue() {
        return this.getValueByParentKey('originalPrimaryKey');
    }

    /**
     *
     * @param {string} parentProperty
     * @return {Model|null}
     */
    getValueByParentKey(parentProperty) {
        const type = this.$parent.className;
        const id = this.$parent[parentProperty];
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