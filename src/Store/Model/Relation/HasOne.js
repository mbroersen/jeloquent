import Relation from "../Relation.js";

export default class HasOne extends Relation {

    constructor(model) {
        super(model);
    }

    setName() {
        this.foreignKey = `${this.$parent.constructor.snakeCaseClassName()}_id`;
        return this;
    }

    getRelationalFields() {
        return [];
    }

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

    get value() {
        const className = this.model.className();
        const indexes = globalThis.Store.database().indexes(className);

        if (!Object.prototype.hasOwnProperty.call(indexes, this.foreignKey)) {
            return null;
        }

        const keyIndex = indexes[this.foreignKey];
        if (!Object.prototype.hasOwnProperty.call(keyIndex, this.$parent.primaryKey)) {
            return null;
        }

        return globalThis.Store.database().find(className,
            keyIndex[this.$parent.primaryKey][0] ?? null
        );
    }
}