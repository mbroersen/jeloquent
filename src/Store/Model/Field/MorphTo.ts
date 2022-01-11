import Field from "../Field";

export default class MorphTo extends Field {

    constructor(name) {
        super(name);
    }

    get value() {
        const name = this.$parent.snakeCaseClassName;

        const type = this.$parent[`${name}_type`];
        const id = this.$parent[`${name}_id`];

        return globalThis.Store.classInstances[type].constructor.find(id);
    }

    protected setFillPropertyOnParent(): void {
        Object.defineProperty(this.$parent,
            `_${this.name}`,
            {
                set: (value) => {
                    if (!Array.isArray(value)) {
                        value = [value];
                    }

                    const name = this.$parent.snakeCaseClassName;
                    const type = `${name}_type`;
                    const id = `${name}_id`;

                    for (const record of value) {
                        record['id'] = record[id];
                        globalThis.Store.classInstances[record[type]].constructor.insert(record);
                    }
                }
            });
    }
}