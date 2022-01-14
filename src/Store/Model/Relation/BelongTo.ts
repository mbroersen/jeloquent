import Relation from "../Relation";
import {ModelStaticInterface} from "../../../JeloquentInterfaces";

export default class BelongsTo extends Relation {

    constructor(model: ModelStaticInterface, foreignKey: string|null = null, name: string = null) {
        super(model, (foreignKey ?? `${model.snakeCaseClassName}_id`), name);
    }

    get originalValue() {
        return this.model.find(this.$parent[`original_${this.foreignKey}`]);
    }

    get value() {
        return this.model.find(this.$parent[this.foreignKey]);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    set value(value) {

    }

    setName(): BelongsTo {
        const className = this.model.snakeCaseClassName;
        this.$name = this.$name ?? `${className}`;
        return this;
    }

    protected setParentProperties() {
        super.setParentProperties();

        let name = '';
        for (const namePart of this.$name.split('_')) {
            name += namePart[0].toUpperCase() + namePart.slice(1);
        }

        Object.defineProperty(this.$parent,
            `has${name}`, {
                get: () => {
                    return this.value !== null;
                },
            }
        )

        return this;
    }
}