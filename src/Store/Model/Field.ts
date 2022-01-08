import {ModelInterface} from "../../JeloquentInterfaces";

export default class Field {

    private $fieldValue: unknown;

    private $name: string;

    private $originalValue: unknown;

    private $parent: ModelInterface;

    private $previousValue: unknown;

    private isPrimary: boolean;

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
    get isDirty(): boolean {
        return this.$fieldValue != this.$previousValue;
    }

    /**
     *
     * @return {*}
     */
    get originalValue(): unknown {
        return this.$originalValue;
    }

    /**
     *
     * @return {any}
     */
    get previousValue(): unknown {
        return this.$previousValue;
    }

    /**
     *
     * @return {any}
     */
    get value(): unknown {
        return this.$fieldValue;
    }

    /**
     *
     * @param value
     */
    set value(value: unknown) {
        this.$fieldValue = value;
    }

    addParentFieldValueLookUp(): void {
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

    addParentOriginalValueLookUp(): void {
        Object.defineProperty(this.$parent,
            `original_${this.$name}`, {
                get: () => {
                    return this.originalValue;
                },
            }
        )
    }

    resetDirty(): void {
        this.$originalValue = JSON.parse(JSON.stringify(this.$fieldValue));
        this.$previousValue = JSON.parse(JSON.stringify(this.$fieldValue));
    }

    setFillPropertyOnParent(): void {
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
     * @return {Field}
     */
    setName() {
        return this;
    }

    /**
     *
     * @return {Field}
     */
    setParentProperties(): Field {
        this.addParentFieldValueLookUp();
        this.addParentOriginalValueLookUp();
        this.setFillPropertyOnParent();

        return this;
    }

    setup(parent: ModelInterface): Field {
        this.$parent = parent;
        return this.setName().setParentProperties();
    }


    tableSetup(): void {
        //todo setup table;
    }

    toJson(): object {
        const object = {};
        object[this.$name] = this.value;
        return JSON.parse(JSON.stringify(object));
    }
}