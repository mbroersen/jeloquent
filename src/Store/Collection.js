
export default class Collection extends Array {

    constructor(...items) {
        super(...items);
    }

    _getRowFieldResult(row, lookUpFields) {
        let resultField = row[lookUpFields[0]] ?? null;
        for (let i = 1; i < lookUpFields.length; i++) {
            const currentField = lookUpFields[i];

            if (resultField === null) {
                break;
            }

            if (resultField instanceof Collection) {
                return resultField.pluck(lookUpFields[i]);
            }

            resultField = resultField[currentField] ?? null;
        }

        return resultField;
    }

    pluck(field, keyField) {
        const lookUpFields = field.split('.');

        if (keyField) {
            const lookUpKeyField = keyField.split('.');
            const result = {};
            for (let i in this) {
                result[this._getRowFieldResult(this[i], lookUpKeyField)] = this._getRowFieldResult(this[i], lookUpFields);
            }
            return result;
        }

        const result = [];
        for (let i in this) {
            result.push(this._getRowFieldResult(this[i], lookUpFields));
        }

        return result;
    }

    first() {
        return this[0] ?? null;
    }

    last() {
        return this.slice(-1)[0] ?? null;
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

        if (!Object.prototype.hasOwnProperty.call(operators, operator)) {
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