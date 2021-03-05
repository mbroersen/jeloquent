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
     * @return {Model|null}
     */
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
     * @return {*[]}
     */
    getRelationalFields() {
        return [];
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