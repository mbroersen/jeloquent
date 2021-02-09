import Field from "../Field";

export default class ForeignKey extends Field {

    constructor(name, foreignKey) {
        super(name);
        this.foreignKey = name ?? foreignKey;
    }

    tableSetup(table) {
        table.registerIndex(this.foreignKey);
    }

    get value() {
        return this.fieldValue;
    }

    set value(value) {
        this.fieldValue = value;
    }

    setFillPropertyOnParent() {
        Object.defineProperty(this.$parent,
            `_${this.$name}`,
            {
                set: (value) => {
                    this.$parent.removeFromIndex(this);
                    this.fieldValue = value;
                    this.$parent.addToIndex(this);
                }
            });
    }
}