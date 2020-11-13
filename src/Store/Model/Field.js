
export default class Field {

    constructor(name, isPrimary) {
        this.isPrimary = isPrimary ?? false;
        this.$name = name;
        this.fieldValue = null;
        this.previousValue = undefined;
        this.$parent = null;
    }

    setName() {
        return this;
    }

    setup(parent) {
        this.$parent = parent;
        return this.setName().setParentProperties();
    }

    tableSetup() {
        //todo setup table;
    }

    setParentProperties() {
        Object.defineProperty(this.$parent,
            this.$name, {
                get: () => {
                    return this.value;
                },
                set: (value) => {
                    this.previousValue = JSON.parse(JSON.stringify(this.value ?? value));
                    this.value = value;
                }
            }
        )

        this.setFillPropertyOnParent();

        return this;
    }

    setFillPropertyOnParent() {
        Object.defineProperty(this.$parent,
            `_${this.$name}`,
            {
                set: (value) => {
                    this.previousValue = JSON.parse(JSON.stringify(this.value));
                    this.fieldValue = value;
                }
        });
    }

    get isDirty() {
        return this.fieldValue != this.previousValue;
    }

    resetDirty() {
        this.previousValue = JSON.parse(JSON.stringify(this.fieldValue));
    }

    toJson() {
        const object = {};
        object[this.$name] = this.fieldValue;
        return JSON.parse(JSON.stringify(object));
    }

    get value() {
        return this.fieldValue;
    }

    set value(value) {
        this.fieldValue = value;

        // todo fix entity store update
        // const objectValue = {}
        //
        // window.Store.database().update(
        //     this.$parent.constructor.name,
        //     {...value}
        // );
    }
}