import Relation from "../Relation";
import Field from "../Field";

export default class MorphOne extends Field {

    //this.parent.comments
    constructor(name) {
        super(name);
    }


    get value() {
        const type = this.$parent[`${this.$name}_type`];
        const id = this.$parent[`${this.$name}_id`];

        return Store.classInstances[type].constructor().find(id);
    }
}