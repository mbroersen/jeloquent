import Relation from "../Relation.js";

export default class BelongsTo extends Relation {

    constructor(model, foreignKey) {
        super(model, foreignKey);
    }

    setName() {
        this.$name = `${this.model.className().toLowerCase()}`;
        this.foreignKey = `${this.model.className().toLowerCase()}_id`;
        return this;
    }


    setParentProperties() {
        super.setParentProperties();

        Object.defineProperty(this.$parent,
            `has${this.model.className()}`, {
                get: () => {
                    return this.value !== undefined;
                },
            }
        )

        return this;
    }

    get value() {
        return this.model.select(this.$parent[this.foreignKey]);
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