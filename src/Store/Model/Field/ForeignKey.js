import Field from "../Field";


//should return User or Team
export default class ForeignKey extends Field {

    constructor(name, foreignKey) {
        super(name);

        this.foreignKey = name ?? foreignKey;
    }

    tableSetup(table) {
        table.addIndex(this.foreignKey);
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

    setFillPropertyOnParent() {
        // todo updating relation should update indexes;
        Object.defineProperty(this.$parent,
            `_${this.$name}`,
            {
                set: (value) => {
                    this.$parent.removeFromIndex(this);
                    this.fieldValue = value;
                    this.$parent.addToIndex(this);
                }
            });
    }
}