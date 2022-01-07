/**
 *
 */
export default class Collection extends Array {

    /**
     *
     * @param items
     */
    constructor(...items) {
        super(...items);
    }

    /**
     *
     * @param row
     * @param lookUpFields
     * @return {{}|[]|*}
     * @private
     */
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

    /**
     *
     * @return {T|null}
     */
    first() {
        return this[0] ?? null;
    }

    /**
     * @return {string}
     */
    jsonStringify() {
        return JSON.stringify(this);
    }

    /**
     *
     * @return {T|null}
     */
    last() {
        return this.slice(-1)[0] ?? null;
    }

    /**
     *
     * @param array
     * @return {Collection}
     */
    merge(array) {
        this.push(...array);
        return this;
    }

    /**
     *
     * @param field
     * @param keyField
     * @return {{}|[]}
     */
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

    /**
     *
     * @return {T}
     */
    random() {
        return this[Math.round(((this.length - 1) * Math.random()))];
    }

    /**
     *
     * @param field
     * @return {Collection}
     */
    unique(field) {
        const unique = {};
        for (let i in this) {
            unique[this[i][field]] = this[i];
        }

        return new Collection(...Object.values(unique));
    }

    /**
     *
     * @param field
     * @param operator
     * @param value
     * @return {boolean|Collection}
     */
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

    /**
     *
     * @param field
     * @param values
     * @return {Collection}
     */
    whereBetween(field, values) {
        return this.whereIfFunction(field, (field, object) => {
            const fieldValue = object[field];
            return fieldValue >= values[0] && fieldValue <= values[1]
        });
    }

    /**
     *
     * @param field
     * @param whereIfFunction
     * @return {Collection}
     */
    whereIfFunction(field, whereIfFunction) {
        const reqister = new Collection();
        for (let i in this) {
            if (whereIfFunction(field, this[i])) {
                reqister.push(this[i]);
            }
        }
        return reqister;
    }

    /**
     *
     * @param field
     * @param values
     * @return {Collection}
     */
    whereIn(field, values) {
        return this.whereIfFunction(field, (field, object) => {
            return values.includes(object[field]);
        });
    }

    /**
     *
     * @param classInstance
     * @return {Collection}
     */
    whereInstanceOf(classInstance) {
        return this.whereIfFunction(null, (field, object) => {
            return object instanceof classInstance;
        });
    }

    /**
     *
     * @param field
     * @param values
     * @return {Collection}
     */
    whereNotBetween(field, values) {
        return this.whereIfFunction(field, (field, object) => {
            const fieldValue = object[field];
            return !(fieldValue >= values[0] && fieldValue <= values[1])
        });
    }

    /**
     *
     * @param field
     * @param values
     * @return {Collection}
     */
    whereNotIn(field, values) {
        return this.whereIfFunction(field, (field, object) => {
            return !values.includes(object[field]);
        });
    }

    /**
     *
     * @param classInstance
     * @return {Collection}
     */
    whereNotInstanceOf(classInstance) {
        return this.whereIfFunction(null, (field, object) => {
            return !(object instanceof classInstance);
        });
    }

    /**
     *
     * @param field
     * @return {Collection}
     */
    whereNotNull(field) {
        return this.whereIfFunction(field, (field, object) => {
            return object[field] !== null;
        });
    }

    /**
     *
     * @param field
     * @return {Collection}
     */
    whereNull(field) {
        return this.whereIfFunction(field, (field, object) => {
            return object[field] === null;
        });
    }
}