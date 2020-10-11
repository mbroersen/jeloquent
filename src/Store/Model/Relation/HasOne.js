import Relation from "../Relation.js";

export default class HasOne extends Relation {

    constructor(model) {
        super(model);
    }

    setName() {
        this.foreignKey = `${this.$parent.constructor.snakeCaseClassName()}_id`;
        return this;
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
        const indexes = Store.database().indexes(className);

        if (indexes.hasOwnProperty(this.foreignKey)) {
            return Store.database().find(className,
                indexes[this.foreignKey][this.$parent.primaryKey][0] ?? null
            );
        }

        return null;
    }
}