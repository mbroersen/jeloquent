import Relation from "../Relation.js";

export default class BelongsTo extends Relation {

    constructor(model, foreignKey) {
        super(model, (foreignKey ?? `${model.snakeCaseClassName()}_id`));
    }

    setName() {
        let className = this.model.snakeCaseClassName();
        this.$name = `${className}`;
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
        return this.model.find(this.$parent[this.foreignKey]);
    }

    set value(value) {
        //todo update entity store

    }

    // set value(value) {
    //     const foreignKey = {};
    //     foreignKey[this.foreignKey] = this.$parent[this.foreignKey];
    //
    //     if (foreignKey[this.foreignKey] === null) {
    //         return;
    //     }
    //
    //     this.model.update(
    //        {...value, ...foreignKey}
    //     );
    // }

}