import * as Operators from './Collection/Where/Operators';

/**
 *
 */
export default class Collection extends Array {

    constructor(...items) {
        super(...items);
    }

    get operators() {
        return {
            '==': Operators.equal,
            '!=': Operators.notEqual,
            '>=': Operators.gtAndEqual,
            '<=': Operators.ltAndEqual,
            '>': Operators.gt,
            '<': Operators.lt,
        }
    }

    first() {
        return this[0] ?? null;
    }

    last() {
        return this.slice(-1)[0] ?? null;
    }

    merge(array): Collection {
        this.push(...array);
        return this;
    }

    pluck(field: string, keyField = '') {
        const lookUpFields = field.split('.');

        if (keyField) {
            const lookUpKeyField = keyField.split('.');
            const result = {};
            for (const i in this) {
                result[this._getRowFieldResult(this[i], lookUpKeyField)] = this._getRowFieldResult(this[i], lookUpFields);
            }
            return result;
        }

        const result = [];
        for (const i in this) {
            result.push(this._getRowFieldResult(this[i], lookUpFields));
        }

        return result;
    }

    random() {
        return this[Math.round(((this.length - 1) * Math.random()))];
    }

    toJSON() {
        return this.toObject();
    }

    toObject() {
        return this.map((item) => {
            return (item.toObject?.() ?? item);
        });
    }

    unique(field: string): Collection {
        const unique = {};
        for (const i in this) {
            unique[this[i][field]] = this[i];
        }

        return new Collection(...Object.values(unique));
    }

    where(field: string, operator: string, value = null): Collection {
        value = value ?? operator;
        operator = (operator === value) ? '==' : operator;

        if (!Object.prototype.hasOwnProperty.call(this.operators, operator)) {
            throw new Error("Invalid comparison operator used");
        }

        return this.whereIfFunction(field, (field, object) => {
            return this.operators[operator](object[field], value);
        })
    }

    whereBetween(field: string, values): Collection {
        return this.whereIfFunction(field, (field, object) => {
            const fieldValue = object[field];
            return fieldValue >= values[0] && fieldValue <= values[1]
        });
    }

    whereIfFunction(field: string, whereIfFunction: CallableFunction): Collection {
        const register = new Collection();
        for (const i in this) {
            if (whereIfFunction(field, this[i])) {
                register.push(this[i]);
            }
        }
        return register;
    }

    whereIn(field: string, values): Collection {
        return this.whereIfFunction(field, (field, object) => {
            return values.includes(object[field]);
        });
    }

    whereInstanceOf(classInstance): Collection {
        return this.whereIfFunction(null, (field, object) => {
            return object instanceof classInstance;
        });
    }

    whereNotBetween(field: string, values): Collection {
        return this.whereIfFunction(field, (field, object) => {
            const fieldValue = object[field];
            return !(fieldValue >= values[0] && fieldValue <= values[1])
        });
    }

    whereNotIn(field: string, values): Collection {
        return this.whereIfFunction(field, (field, object) => {
            return !values.includes(object[field]);
        });
    }

    whereNotInstanceOf(classInstance): Collection {
        return this.whereIfFunction(null, (field, object) => {
            return !(object instanceof classInstance);
        });
    }

    whereNotNull(field: string): Collection {
        return this.whereIfFunction(field, (field, object) => {
            return object[field] !== null;
        });
    }


    whereNull(field: string): Collection {
        return this.whereIfFunction(field, (field, object) => {
            return object[field] === null;
        });
    }





    private _getRowFieldResult(row, lookUpFields) {
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
}