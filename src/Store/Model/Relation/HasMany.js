import Relation from "../Relation.js";

export default class HasMany extends Relation {

    constructor(model, foreignKey, localKey) {
        super(model, foreignKey);
        this.localKey = localKey ?? 'id';
    }

    setName() {
        const parentClassName = this.$parent.constructor.snakeCaseClassName();
        const modelClassName = this.model.snakeCaseClassName();

        this.foreignKey = `${parentClassName}_id`;
        this.$name = `${modelClassName}s`;
        return this;
    }

    getRelationalFields() {
        return [];
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
            `has${this.model.className()}s`, {
                get: () => {
                    return this.count > 0;
                },
            }
        );
        return this;
    }

    get count() {
        let indexes = globalThis.Store.database().indexes(this.model.className());
        return indexes.get(this.foreignKey).get(this.$parent[this.localKey])?.size ?? 0;
    }

    get value() {
        const className = this.model.className();
        const keyIndex = this.model.getIndexByKey(this.foreignKey);

        return globalThis.Store.database().find(className,
            [...(keyIndex.get(this.$parent[this.localKey])?.values()) ?? []]
        );
    }

    set value(values) {
        //todo updateEntities in store
    }
}