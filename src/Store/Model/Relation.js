import Field from "./Field.js";

export default class Relation extends Field {

    constructor(model, foreignKey) {
        super(model.className().toLowerCase());
        this.model = model;
        this.foreignKey = foreignKey;
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