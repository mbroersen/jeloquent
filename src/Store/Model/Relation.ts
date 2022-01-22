import Field from "./Field";
import ForeignKey from "./Field/ForeignKey";
import {ModelStaticInterface, TableInterface} from "../../JeloquentInterfaces";

/**
 *
 */
export default class Relation extends Field {

    foreignKey: string;

    model: ModelStaticInterface;

    constructor(model: ModelStaticInterface, foreignKey: string = null, name: string = null) {
        const className = name ?? model.snakeCaseClassName;
        super(className);
        this.model = model;
        this.foreignKey = foreignKey;
    }

    set _value(value: Record<string, unknown>|Record<string, unknown>[]) {
        if (!Array.isArray(value)) {
            value = [value];
        }

        value.forEach((modelValue) => {
            this.model.insert(modelValue);
        });
    }

    getRelationalFields(): ForeignKey[] {
        return [new ForeignKey(this.foreignKey).setRelation(this)];
    }

    tableSetup(table: TableInterface): void {
        table.registerIndex(this.foreignKey);
    }
}