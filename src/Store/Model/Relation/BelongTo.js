import Relation from "../Relation.js";

/**
 *
 */
export default class BelongsTo extends Relation {

    /**
     *
     * @param {Model} model
     * @param {string} foreignKey
     * @param {string} name
     */
    constructor(model, foreignKey, name) {
        super(model, (foreignKey ?? `${model.snakeCaseClassName}_id`), name);
    }

    get originalValue() {
        return this.model.find(this.$parent[`original_${this.foreignKey}`]);
    }

    get value() {
        return this.model.find(this.$parent[this.foreignKey]);
    }

    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures,@typescript-eslint/no-empty-function
    set value(value) {

    }

    /**
     *
     * @return {BelongsTo}
     */
    setName() {
        let className = this.model.snakeCaseClassName;
        this.$name = this.$name ?? `${className}`;
        return this;
    }

    /**
     *
     * @return {BelongsTo}
     */
    setParentProperties() {
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