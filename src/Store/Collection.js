
export default class Collection extends Array {

    constructor(...items) {
        super(...items);
    }

    pluck(field, keyField) {
        if (keyField) {
            const result = {};
            for (let i in this) {
                result[this[i][keyField]] = this[i][field];
            }
            return result;
        }

        const result = [];
        for (let i in this) {
            result.push(this[i][field]);
        }

        return result;
    }

    merge(array) {
        this.push(...array);
        return this;
    }

    whereIfFunction(field, whereIfFunction) {
        const reqister = new Collection();
        for (let i in this) {
            if (whereIfFunction(field, this[i])) {
                reqister.push(this[i]);
            }
        }
        return reqister;
    }

    where(field, operator, value) {
        value = value ?? operator;
        operator = (operator === value) ? '==' : operator;
        const operators = {
            '>'(fieldValue, value) {
                return fieldValue > value;
            },
            '>='(fieldValue, value) {
                return fieldValue >= value;
            },
            '<'(fieldValue, value) {
                return fieldValue < value;
            },
            '<='(fieldValue, value) {
                return fieldValue <= value;
            },
            '!='(fieldValue, value) {
                return fieldValue != value;
            },
            '=='(fieldValue, value) {
                return fieldValue == value;
            }
        }

        if (!operators.hasOwnProperty(operator)) {
            throw new Error("Invalid comparison operator used");
        }

        return this.whereIfFunction(field, (field, object) => {
            return operators[operator](object[field], value);
        })
    }

    whereBetween(field, values) {
        return this.whereIfFunction(field, (field, object) => {
            const fieldValue = object[field];
            return fieldValue >= values[0] && fieldValue <= values[1]
        });
    }

    whereNotBetween(field, values) {
        return this.whereIfFunction(field, (field, object) => {
            const fieldValue = object[field];
            return !(fieldValue >= values[0] && fieldValue <= values[1])
        });
    }

    whereNull(field) {
        return this.whereIfFunction(field, (field, object) => {
            return object[field] === null;
        });
    }

    whereNotNull(field) {
        return this.whereIfFunction(field, (field, object) => {
            return object[field] !== null;
        });
    }

    whereIn(field, values) {
        return this.whereIfFunction(field, (field, object) => {
            return values.includes(object[field]);
        });
    }

    whereNotIn(field, values) {
        return this.whereIfFunction(field, (field, object) => {
            return !values.includes(object[field]);
        });
    }

    whereInstanceOf(classInstance) {
        return this.whereIfFunction(null, (field, object) => {
            return object instanceof classInstance;
        });
    }

    whereNotInstanceOf(classInstance) {
        return this.whereIfFunction(null, (field, object) => {
            return !(object instanceof classInstance);
        });
    }
}