import Relation from "../Relation";
import {ModelStaticInterface} from "../../../JeloquentInterfaces";
import ForeignKey from "../Field/ForeignKey";

/**
 *
 */
export default class HasOne extends Relation {

    constructor(model: ModelStaticInterface) {
        super(model);
    }

    get originalValue(): unknown {
        return this.getValueByParentKey('originalPrimaryKey');
    }

    get value(): unknown {
        return this.getValueByParentKey('primaryKey');
    }

    getRelationalFields():Array<ForeignKey> {
        return [];
    }

    setName(): HasOne {
        this.foreignKey = `${this.$parent.snakeCaseClassName}_id`;
        return this;
    }

    protected setParentProperties(): HasOne {
        super.setParentProperties();

        Object.defineProperty(this.$parent,
            `has${this.model.className}`, {
                get: () => {
                    return this.value !== null;
                },
            }
        )

        return this;
    }

    private getValueByParentKey(parentProperty) {
        const keyIndex = this.model.getIndexByKey(this.foreignKey);
        return globalThis.Store.database().find(this.model.className,
            [...keyIndex.get(`${this.$parent[parentProperty]}`)?.values() ?? []]
        ).first();
    }
}