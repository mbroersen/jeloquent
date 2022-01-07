import Relation from "../Relation.js";

/**
 *
 */
export default class HasMany extends Relation {

    /**
     *
     * @param {Model} model
     * @param {string} foreignKey
     * @param {string} localKey
     */
    constructor(model, foreignKey, localKey) {
        super(model, foreignKey);
        this.localKey = localKey ?? 'id';
    }

    get count() {
        let indexes = globalThis.Store.database().indexes(this.model.className);
        return indexes.get(this.foreignKey).get(this.$parent.primaryKey)?.size ?? 0;
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
        );
    }

    setName() {
        const parentClassName = this.$parent.snakeCaseClassName;
        const modelClassName = this.model.snakeCaseClassName;

        this.foreignKey = `${parentClassName}_id`;
        this.$name = `${modelClassName}s`;
        return this;
    }

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
            `has${this.model.className}s`, {
                get: () => {
                    return this.count > 0;
                },
            }
        );
        return this;
    }
}