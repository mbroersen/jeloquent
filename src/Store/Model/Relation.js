import Field from "./Field.js";
import ForeignKey from "./Field/ForeignKey";

export default class Relation extends Field {

    constructor(model, foreignKey) {
        let className = model.snakeCaseClassName();
        super(className);
        this.model = model;
        this.foreignKey = foreignKey;
    }

    tableSetup(table) {
        table.addIndex(this.foreignKey);
    }


    getRelationalFields() {
        return [new ForeignKey(this.foreignKey)];
    }

    setFillPropertyOnParent() {
        Object.defineProperty(this.$parent,
            `_${this.$name}`,
            {
                set: (value) => {
                    if (!Array.isArray(value)) {
                        value = [value];
                    }
                    value.forEach((modelValue) => {
                        if (!this.model.ids().includes(modelValue.id)) {
                            this.model.insert(modelValue);
                        }
                    });

                }
            });
    }

}