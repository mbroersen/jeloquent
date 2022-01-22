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

    set _value(value) {
        if (this.$originalValue === undefined) {
            this.$originalValue = JSON.parse(JSON.stringify(this.value ?? value));
        }

        this.$previousValue = JSON.parse(JSON.stringify(this.value));
        this.$fieldValue = value;
    }

    set value(value: unknown) {
        if (this.$previousValue === undefined) {
            this.$previousValue = JSON.parse(JSON.stringify(this.value ?? value));
        }

        if (this.$originalValue === undefined) {
            this.$originalValue = JSON.parse(JSON.stringify(this.value ?? value));
        }

        this.$previousValue = JSON.parse(JSON.stringify(this.value));

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

    protected setParentProperties(): Field {
        return this;
    }
}