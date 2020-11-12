import Relation from "../Relation.js";

/**
 *
 */
export default class HasManyThrough extends Relation {

    //this.parent.comments
    constructor(model, throughModel, foreignKey, localKey) {
        super(model, foreignKey);
        this.model = model;
        this.throughModel = throughModel;
        this.localKey = localKey ?? 'id';
    }

    setName() {
        this._lcThroughModelClassName = this.throughModel.snakeCaseClassName();
        this._lcModelClassName = this.model.snakeCaseClassName();
        this._lcParentClassName = this.$parent.constructor.snakeCaseClassName();
        this.foreignKey = `${this._lcThroughModelClassName}_id`;
        this.$name = `${this._lcModelClassName}s`;
        return this;
    }

    tableSetup(table) {
        //todo fix this;
        //table

       this.model.addIndex(this.indexName);
    }

    getRelationalFields() {
        return [];
    }

    setParentProperties() {
        super.setParentProperties();
    }

    get indexName() {
        return `${this._lcThroughModelClassName}.${this._lcParentClassName}_id`;
    }

    get value() {
        const className = this.model.className();
        const indexes = window.Store.database().indexes(className);

        if (Object.prototype.hasOwnProperty.call(indexes, this.indexName)) {
            return window.Store.database().find(className,
                indexes[this.indexName][this.$parent[this.localKey]] ?? []
            );
        }

        const foreignKey = `${this._lcModelClassName}s`;
        const throughForeignKey = `${this._lcThroughModelClassName}s`;

        return this.$parent[throughForeignKey].reduce(
            (array, object) => {
                array.push(...object[foreignKey]);
                return array
            },
        []);
    }

}