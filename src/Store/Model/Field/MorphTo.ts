import Field from "../Field";

export default class MorphTo extends Field {

    constructor(name) {
        super(name);
    }

    get value() {
        const name = this.$parent.snakeCaseClassName;

        const type = this.$parent[`${name}_type`];
        const id = this.$parent[`${name}_id`];

        return Object.getPrototypeOf(globalThis.Store.classInstances[type]).constructor.find(id);
    }

    set _value(value) {
        if (!Array.isArray(value)) {
            value = [value];
        }

        const name = this.$parent.snakeCaseClassName;
        const type = `${name}_type`;
        const id = `${name}_id`;

        for (const record of value) {
            record['id'] = record[id];
            Object.getPrototypeOf(globalThis.Store.classInstances[record[type]]).constructor.insert(record);
        }
    }
}