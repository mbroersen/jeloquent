import Field from "./Field.js";
import ForeignKey from "./Field/ForeignKey";

export default class Relation extends Field {

    constructor(model, foreignKey, name) {
        let className = name ?? model.snakeCaseClassName();
        super(className);
        this.model = model;
        this.foreignKey = foreignKey;
    }

    tableSetup(table) {
        table.registerIndex(this.foreignKey);
    }

    deleteRelationLookUpKey() {
        let className = this.model.className();
        globalThis.Store.database().unregisterLookUpKey(className, this.foreignKey, this.$parent.primaryKey);
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
                        if (!(this.model.ids().includes(modelValue.id))) {
                            this.model.insert(modelValue);
                        }
                    });

                }
            });
    }

}