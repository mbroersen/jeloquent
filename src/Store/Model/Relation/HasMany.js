import Relation from "../Relation.js";

export default class HasMany extends Relation {

    constructor(model, foreignKey, localKey) {
        super(model, foreignKey);
        this.localKey = localKey ?? 'id';
    }

    setName() {
        this.foreignKey = `${this.$parent.constructor.className().toLowerCase()}_id`;
        this.$name = `${this.model.className().toLowerCase()}s`;
        return this;
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
        const index = Store.database().indexes(this.model.className())[this.foreignKey] ?? {};
        return index[this.$parent[this.localKey]]?.length ?? 0;
    }

    get value() {
        if (Store.database().indexes(this.model.className()).hasOwnProperty(this.foreignKey)) {
            return Store.database().indexes(this.model.className())[this.foreignKey][this.$parent[this.localKey]]?.reduce((obj, key) => {
                obj.push(this.model.select(key));
                return obj;
            }, []) ?? [];
        }

        return Store.database().allModels(this.model.className()).filter(model => {
            return model[this.foreignKey] === this.$parent[this.localKey];
        });
    }

    set value(values) {
        //todo updateEntities in store
    }

}