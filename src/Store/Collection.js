
export default class Collection extends Array {

    constructor(...items) {
        super(...items);
    }

    // pluck(field, keyField) {
    //     console.log(this.items, this);
    //     return;
    // }

    whereIfFunction(field, whereIfFunction) {
        const reqister = new Collection();
        for (let i in this) {
            if (whereIfFunction(field, this[i])) {
                reqister.push(this[i]);
            }
        }
        return reqister;
    }

    where(field, value) {
        return this.whereIfFunction(field, (field, object) => {
            return object[field] === value;
        })
    }

    whereBetween(field, values) {
        return this.whereIfFunction(field, (field, object) => {
            const fieldValue = object[field];
            return fieldValue >= values[0] && fieldValue <= values[1]
        });
    }

    whereNull(field) {
        return this.whereIfFunction(field, (field, object) => {
            return object[field] === null;
        });
    }

    whereIn(field, values) {
        return this.whereIfFunction(field, (field, object) => {
            return values.includes(object[field]);
        });
    }

    whereInstanceOf(classInstance) {
        return this.whereIfFunction(null, (field, object) => {
            return object instanceof classInstance;
        });
    }
}