import Relation from "../Relation";
import {ModelStaticInterface} from "../../../JeloquentInterfaces";
import Collection from "../../Collection";
import ForeignKey from "../Field/ForeignKey";

/**
 *
 */
export default class HasMany extends Relation {

    localKey: string;

    constructor(model: ModelStaticInterface, foreignKey: string = null, localKey: string = null) {
        super(model, foreignKey);
        this.localKey = localKey ?? 'id';
    }

    get count(): number {
        const indexes = globalThis.Store.database().indexes(this.model.className);
        return indexes.get(this.foreignKey).get(this.$parent.primaryKey)?.size ?? 0;
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

    setName(): HasMany {
        const parentClassName = this.$parent.snakeCaseClassName;
        const modelClassName = this.model.snakeCaseClassName;

        this.foreignKey = `${parentClassName}_id`;
        this.$name = `${modelClassName}s`;
        return this;
    }

    protected getValueByParentKey(parentProperty): Collection {
        const keyIndex = this.model.getIndexByKey(this.foreignKey);
        return globalThis.Store.database().find(this.model.className,
            [...keyIndex.get(`${this.$parent[parentProperty]}`)?.values() ?? []]
        );
    }

    protected setParentProperties(): HasMany {
        super.setParentProperties();

        // todo remove and move to proxy
        Object.defineProperty(this.$parent,
            `${this.name}Count`, {
                get: () => {
                    return this.count;
                },
            }
        );

        // todo remove and move to proxy
        Object.defineProperty(this.$parent,
            `has${this.model.className}s`, {
                get: () => {
                    return this.count > 0;
                },
            }
        );
        return this;
    }
}