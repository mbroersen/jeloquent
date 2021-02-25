import Field from "../Field";

/**
 *
 */
export default class ForeignKey extends Field {

    /**
     *
     * @param name
     * @param foreignKey
     */
    constructor(name, foreignKey) {
        super(name);
        this.foreignKey = name ?? foreignKey;
    }

    setRelation(relation) {
        this.relation = relation;
        return this;
    }

    /**
     *
     * @return {null}
     */
    get value() {
        return this.fieldValue;
    }

    /**
     *
     * @param value
     */
    set value(value) {
        this.fieldValue = value;
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
     */
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