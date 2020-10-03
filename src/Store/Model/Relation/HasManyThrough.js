import Relation from "../Relation.js";

/**
 * TODO add foreignKey to comments table based on parent model;
 */
export default class HasManyThrough extends Relation {

    //this.parent.comments
    constructor(model, throughModel, foreignKey, localKey) {
        super(model, foreignKey);
        this.throughModel = throughModel;
        this.localKey = localKey ?? 'id';
    }

    setName() {
        this.foreignKey = `${this.throughModel.className().toLowerCase()}_id`;
        this.$name = `${this.model.className().toLowerCase()}s`;
        return this;
    }

    setParentProperties() {
        super.setParentProperties();
    }

    get indexName() {
        return `${this.throughModel.className().toLowerCase()}.${this.$parent.constructor.className().toLowerCase()}_id`;
    }

    get value() {
        const className = this.model.className();
        const indexes = Store.database().indexes(className);

        if (indexes.hasOwnProperty(this.indexName)) {
            return Store.database().find(className,
                indexes[this.indexName][this.$parent[this.localKey]] ?? []
            );
        }

        const foreignKey = `${this.model.className().toLowerCase()}s`;
        const throughForeignKey = `${this.throughModel.className().toLowerCase()}s`;

        return this.$parent[throughForeignKey].reduce(
            (array, object) => {
                array.push(...object[foreignKey]);
                return array
            },
        []);
    }

}