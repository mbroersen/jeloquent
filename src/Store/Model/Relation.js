import Field from "./Field.js";

export default class Relation extends Field {

    constructor(model, foreignKey) {
        let className = model.snakeCaseClassName();
        super(className);
        this.model = model;
        this.foreignKey = foreignKey;
    }

    getRelationalFields() {
        return [new Field(this.foreignKey)];
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