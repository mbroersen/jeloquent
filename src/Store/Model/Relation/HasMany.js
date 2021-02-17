import Relation from "../Relation.js";

/**
 *
 */
export default class HasMany extends Relation {

    /**
     *
     * @param model
     * @param foreignKey
     * @param localKey
     */
    constructor(model, foreignKey, localKey) {
        super(model, foreignKey);
        this.localKey = localKey ?? 'id';
    }

    /**
     *
     * @return {*|number}
     */
    get count() {
        let indexes = globalThis.Store.database().indexes(this.model.className());
        return indexes.get(this.foreignKey).get(this.$parent.primaryKey)?.size ?? 0;
    }

    /**
     *
     * @return {*}
     */
    get value() {
        const className = this.model.className();
        const keyIndex = this.model.getIndexByKey(this.foreignKey);

        return globalThis.Store.database().find(className,
            [...(keyIndex.get(this.$parent.primaryKey)?.values()) ?? []]
        );
    }

    /**
     *
     * @return {HasMany}
     */
    setName() {
        const parentClassName = this.$parent.constructor.snakeCaseClassName();
        const modelClassName = this.model.snakeCaseClassName();

        this.foreignKey = `${parentClassName}_id`;
        this.$name = `${modelClassName}s`;
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
     * @return {HasMany}
     */
    setParentProperties() {
        super.setParentProperties();

        Object.defineProperty(this.$parent,
            `${this.$name}Count`, {
                get: () => {
                    return this.count;
                },
            }
        );

        Object.defineProperty(this.$parent,
            `has${this.model.className()}s`, {
                get: () => {
                    return this.count > 0;
                },
            }
        );
        return this;
    }
}