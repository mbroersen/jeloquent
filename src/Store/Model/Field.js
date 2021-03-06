/**
 *
 */
export default class Field {

    /**
     *
     * @param name
     * @param isPrimary
     */
    constructor(name, isPrimary) {
        this.isPrimary = isPrimary ?? false;
        this.$name = name;
        this.$fieldValue = null;
        this.$previousValue = undefined;
        this.$originalValue = undefined;
        this.$parent = null;
    }

    /**
     *
     * @return {boolean}
     */
    get isDirty() {
        return this.$fieldValue != this.$previousValue;
    }

    /**
     *
     * @return {*}
     */
    get originalValue() {
        return this.$originalValue;
    }

    /**
     *
     * @return {any}
     */
    get previousValue() {
        return this.$previousValue;
    }

    /**
     *
     * @return {any}
     */
    get value() {
        return this.$fieldValue;
    }

    /**
     *
     * @param value
     */
    set value(value) {
        this.$fieldValue = value;
    }

    /**
     *
     * @return {Field}
     */
    setName() {
        return this;
    }

    /**
     *
     * @param parent
     * @return {Field}
     */
    setup(parent) {
        this.$parent = parent;
        return this.setName().setParentProperties();
    }

    /**
     *
     */
    tableSetup() {
        //todo setup table;
    }

    /**
     *
     */
    addParentFieldValueLookUp() {
        Object.defineProperty(this.$parent,
            this.$name, {
                get: () => {
                    return this.value;
                },
                set: (value) => {
                    if (this.$previousValue === undefined) {
                        this.$previousValue = JSON.parse(JSON.stringify(this.value ?? value));
                    }

                    if (this.$originalValue === undefined) {
                        this.$originalValue = JSON.parse(JSON.stringify(this.value ?? value));
                    }

                    this.$previousValue = JSON.parse(JSON.stringify(this.value));
                    this.value = value;
                }
            }
        )
    }

    addParentOriginalValueLookUp() {
        Object.defineProperty(this.$parent,
            `original_${this.$name}`, {
                get: () => {
                    return this.originalValue;
                },
            }
        )
    }

    /**
     *
     * @return {Field}
     */
    setParentProperties() {
        this.addParentFieldValueLookUp();
        this.addParentOriginalValueLookUp();
        this.setFillPropertyOnParent();

        return this;
    }

    /**
     *
     */
    setFillPropertyOnParent() {
        Object.defineProperty(this.$parent,
            `_${this.$name}`,
            {
                set: (value) => {
                    if (this.$originalValue === undefined) {
                        this.$originalValue = JSON.parse(JSON.stringify(this.value));
                    }

                    this.$previousValue = JSON.parse(JSON.stringify(this.value));
                    this.$fieldValue = value;
                }
            });
    }

    /**
     *
     */
    resetDirty() {
        this.$originalValue = JSON.parse(JSON.stringify(this.$fieldValue));
        this.$previousValue = JSON.parse(JSON.stringify(this.$fieldValue));
    }

    /**
     *
     * @return {any}
     */
    toJson() {
        const object = {};
        object[this.$name] = this.value;
        return JSON.parse(JSON.stringify(object));
    }
}