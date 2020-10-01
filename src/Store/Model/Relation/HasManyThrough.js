import Relation from "../Relation.js";

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

    get value() {
        // Team.comments => Team.each( => User.comments)
        //console.log(this.foreignKey, this.$parent, `${this.throughModel.className().toLowerCase()}s`);

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