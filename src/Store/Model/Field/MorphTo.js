import Field from "../Field";


//should return User or Team
export default class MorphTo extends Field {

    constructor(name) {
        super(name);
    }

    get value() {
        const name = this.$parent.constructor.snakeCaseClassName();

        const type = this.$parent[`${name}_type`];
        const id = this.$parent[`${name}_id`];

        return window.Store.classInstances[type].constructor.find(id);
    }
}