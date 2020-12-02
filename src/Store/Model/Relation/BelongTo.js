import Relation from "../Relation.js";

export default class BelongsTo extends Relation {

    constructor(model, foreignKey, name) {
        super(model, (foreignKey ?? `${model.snakeCaseClassName()}_id`), name);
    }

    setName() {
        let className = this.model.snakeCaseClassName();
        this.$name = this.$name ?? `${className}`;
        return this;
    }


    setParentProperties() {
        super.setParentProperties();

        let name = '';
        for (const namePart of this.$name.split('_')) {
            name += namePart[0].toUpperCase() + namePart.slice(1);
        }

        Object.defineProperty(this.$parent,
            `has${name}`, {
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