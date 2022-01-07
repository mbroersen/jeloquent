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

    get value() {
        return this.$fieldValue;
    }

    set value(value) {
        this.$fieldValue = value;
    }

    setRelation(relation) {
        this.relation = relation;
        return this;
    }

    tableSetup(table) {
        table.registerIndex(this.foreignKey);
    }
}