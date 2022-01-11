import {ModelInterface, TableInterface} from "../../JeloquentInterfaces";

export default class Field {

    protected $fieldValue: unknown;

    protected $name: string;

    protected $originalValue: unknown;

    protected $parent: ModelInterface;

    protected $previousValue: unknown;

    private _isPrimary: boolean;

    /**
     *
     * @param name
     * @param isPrimary
     */
    constructor(name: string, isPrimary = false) {
        this._isPrimary = isPrimary;
        this.$name = name;
        this.$fieldValue = null;
        this.$previousValue = undefined;
        this.$originalValue = undefined;
        this.$parent = null;
    }

    get isDirty(): boolean {
        return this.$fieldValue != this.$previousValue;
    }

    get isPrimary(): boolean {
        return this._isPrimary;
    }

    get name(): string {
        return this.$name;
    }

    get originalValue(): unknown {
        return this.$originalValue;
    }

    get previousValue(): unknown {
        return this.$previousValue;
    }

    get value(): unknown {
        return this.$fieldValue;
    }

    set value(value: unknown) {

        this.$fieldValue = value;
    }

    resetDirty(): void {
        this.$originalValue = JSON.parse(JSON.stringify(this.$fieldValue));
        this.$previousValue = JSON.parse(JSON.stringify(this.$fieldValue));
    }

    setName(): Field {
        return this;
    }

    setup(parent: ModelInterface): Field {
        this.$parent = parent;
        return this.setName().setParentProperties();
    }

    tableSetup(table: TableInterface): void {
        console.info(table.name);
    }

    toJson(): object {
        const object = {};
        object[this.$name] = this.value;
        return JSON.parse(JSON.stringify(object));
    }

    protected addParentFieldValueLookUp(): void {
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

    protected addParentOriginalValueLookUp(): void {
        Object.defineProperty(this.$parent,
            `original_${this.$name}`, {
                get: () => {
                    return this.originalValue;
                },
            }
        )
    }

    protected setFillPropertyOnParent(): void {
        Object.defineProperty(this.$parent,
            `_${this.$name}`,
            {
                set: (value) => {
                    if (this.$originalValue === undefined) {
                        this.$originalValue = JSON.parse(JSON.stringify(this.value ?? value));
                    }

                    this.$previousValue = JSON.parse(JSON.stringify(this.value));
                    this.value = value;
                }
            });
    }

    protected setParentProperties(): Field {
        this.addParentFieldValueLookUp();
        this.addParentOriginalValueLookUp();
        this.setFillPropertyOnParent();

        return this;
    }
}