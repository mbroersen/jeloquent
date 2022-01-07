import Relation from "../Relation.js";

/**
 *
 */
export default class HasOne extends Relation {

    /**
     *
     * @param {Model} model
     */
    constructor(model) {
        super(model);
    }

    get originalValue() {
        return this.getValueByParentKey('originalPrimaryKey');
    }

    get value() {
        return this.getValueByParentKey('primaryKey');
    }

    getRelationalFields() {
        return [];
    }

    getValueByParentKey(parentProperty) {
        const keyIndex = this.model.getIndexByKey(this.foreignKey);
        return globalThis.Store.database().find(this.model.className,
            [...keyIndex.get(this.$parent[parentProperty])?.values() ?? []]
        ).first();
    }

    /**
     *
     * @return {HasOne}
     */
    setName() {
        this.foreignKey = `${this.$parent.snakeCaseClassName}_id`;
        return this;
    }

    /**
     *
     * @return {HasOne}
     */
    setParentProperties() {
        super.setParentProperties();

        Object.defineProperty(this.$parent,
            `has${this.model.className}`, {
                get: () => {
                    return this.value !== null;
                },
            }
        )

        return this;
    }
}