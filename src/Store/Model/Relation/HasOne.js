import Relation from "../Relation.js";

/**
 *
 */
export default class HasOne extends Relation {

    /**
     *
     * @param model
     */
    constructor(model) {
        super(model);
    }

    /**
     *
     * @return {null|*}
     */
    get value() {
        const className = this.model.className();
        const keyIndex = this.model.getIndexByKey(this.foreignKey);

        if (!keyIndex.has(this.$parent.primaryKey)) {
            return null;
        }

        return globalThis.Store.database().find(className,
            [...keyIndex.get(this.$parent.primaryKey).values()] ?? null
        ).first();
    }

    /**
     *
     * @return {HasOne}
     */
    setName() {
        this.foreignKey = `${this.$parent.constructor.snakeCaseClassName()}_id`;
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
            `has${this.model.className()}`, {
                get: () => {
                    return this.value !== null;
                },
            }
        )

        return this;
    }
}