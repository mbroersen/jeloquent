
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

    setParentProperties() {
        if (this.$parent.hasOwnProperty(this.$name)) {
            return;
        }

        Object.defineProperty(this.$parent,
            this.$name, {
                get: () => {
                    return this.value;
                },
                set: (value) => {
                    this.previousValue = JSON.parse(JSON.stringify(this.value));
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
                    this.fieldValue = value;
                }
        });
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