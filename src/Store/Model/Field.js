
export default class Field {

    constructor(name, isPrimary) {
        this.isPrimary = isPrimary ?? false;
        this.$name = name;
        this.fieldValue = null;
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
        Object.defineProperty(this.$parent,
            this.$name, {
                get: () => {
                    return this.value;
                },
                set: (value) => {
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