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
        this.$fieldValue = null;
        this.$previousValue = undefined;
        this.$originalValue = undefined;
        this.$parent = null;
        this.$name = name;
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

    set _value(newValue: unknown) {
        if (this.$originalValue === undefined) {
            this.$originalValue = JSON.parse(JSON.stringify(this.value ?? newValue));
        }
        this.$previousValue = JSON.parse(JSON.stringify(this.value));
        this.$fieldValue = newValue;
    }


    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    set value(newValue: unknown) {
        if (this.$previousValue === undefined) {
            this.$previousValue = JSON.parse(JSON.stringify(this.value ?? newValue));
        }

        if (this.$originalValue === undefined) {
            this.$originalValue = JSON.parse(JSON.stringify(this.value ?? newValue));
        }

        this.$previousValue = JSON.parse(JSON.stringify(this.value));

        this.$fieldValue = newValue;
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

    toJSON(): object {
        const object = {};
        object[this.$name] = this.value;
        return object;
    }

    protected setParentProperties(): Field {
        return this;
    }
}