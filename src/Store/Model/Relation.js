import Field from "./Field.js";
import ForeignKey from "./Field/ForeignKey";

/**
 *
 */
export default class Relation extends Field {

    /**
     *
     * @param model
     * @param foreignKey
     * @param name
     */
    constructor(model, foreignKey, name) {
        let className = name ?? model.snakeCaseClassName();
        super(className);
        this.model = model;
        this.foreignKey = foreignKey;
    }

    /**
     *
     * @param table
     */
    tableSetup(table) {
        table.registerIndex(this.foreignKey);
    }

    /**
     *
     * @return {ForeignKey[]}
     */
    getRelationalFields() {
        return [new ForeignKey(this.foreignKey).setRelation(this)];
    }

    /**
     *
     */
    setFillPropertyOnParent() {
        Object.defineProperty(
            this.$parent,
            `_${this.$name}`,
            {
                set: (value) => {
                    if (!Array.isArray(value)) {
                        value = [value];
                    }
                    value.forEach((modelValue) => {
                        if (!(this.model.ids().includes(modelValue.id))) {
                            this.model.insert(modelValue);
                        }
                    });
                }
            });
    }
}