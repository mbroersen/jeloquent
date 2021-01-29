import Relation from "../Relation.js";

export default class HasMany extends Relation {

    constructor(model, foreignKey, localKey) {
        super(model, foreignKey);
        this.localKey = localKey ?? 'id';
    }

    setName() {
        const parentClassName = this.$parent.constructor.snakeCaseClassName();
        const modelClassName = this.model.snakeCaseClassName();

        this.foreignKey = `${parentClassName}_id`;
        this.$name = `${modelClassName}s`;
        return this;
    }

    getRelationalFields() {
        return [];
    }

    setParentProperties() {
        super.setParentProperties();

        Object.defineProperty(this.$parent,
            `${this.$name}Count`, {
                get: () => {
                    return this.count;
                },
            }
        );

        Object.defineProperty(this.$parent,
            `has${this.model.className()}s`, {
                get: () => {
                    return this.count > 0;
                },
            }
        );
        return this;
    }

    get count() {
        const index = globalThis.Store.database().indexes(this.model.className())[this.foreignKey] ?? {};
        return index[this.$parent[this.localKey]]?.length ?? 0;
    }

    get value() {
        const className = this.model.className();
        const indexes = globalThis.Store.database().indexes(className);

        if (Object.prototype.hasOwnProperty.call(indexes, this.foreignKey)) {
            return globalThis.Store.database().find(className,
                indexes[this.foreignKey][this.$parent[this.localKey]] ?? []
            );
        }

        return globalThis.Store.database().all(this.model.className()).filter(model => {
            return model[this.foreignKey] === this.$parent[this.localKey];
        });
    }

    set value(values) {
        //todo updateEntities in store
    }

}