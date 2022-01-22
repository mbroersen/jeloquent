import Field from "../Field";
import Relation from "../Relation";

export default class ForeignKey extends Field {

    private _foreignKey: string;

    private relation: Relation;

    constructor(name, foreignKey = null) {
        super(name);
        this._foreignKey = name ?? foreignKey;
    }

    get foreignKey(): string {
        return this._foreignKey;
    }

    get value() {
        return this.$fieldValue;
    }

    set value(newValue: unknown) {
        this.$fieldValue = newValue;
    }

    setRelation(relation: Relation) {
        this.relation = relation;
        return this;
    }

    tableSetup(table) {
        table.registerIndex(this.foreignKey);
    }
}