import Relation from "../Relation";
import ForeignKey from "../Field/ForeignKey";
import HasManyThrough from "../Relation/HasManyThrough";
import Field from "../Field";

export function addRelationFieldsToList(fields) {
    const fieldList = [...fields];
    fields.forEach((field, i) => {
        if (field instanceof Relation) {
            fieldList.splice(i, 0, ...field.getRelationalFields());
        }
    });
    return fieldList;
}

export function setFields(model, fields: Field[]) {
    fields.forEach((field) => {
        model._originalFields.set(field.name, field);
        field.setup(modelProxy(model));
    });
    model.numberOfFields = model.originalFields.length;
}

export function setupTable(model, table) {
    model.originalFields.forEach((field) => {
        if (field instanceof ForeignKey) {
            field.tableSetup(table);
        }

        if (field instanceof HasManyThrough) {
            field.tableSetup();
        }
    });
}

export function modelProxy(model) {
    return new Proxy(model, {
        construct(target, argArray, newTarget): object {
            return Reflect.construct(target, argArray, newTarget);
        },

        get(target: any, p: string | symbol, receiver: any): any {
            if (Reflect.has(target, p)) {
                return Reflect.get(target, p);
            }

            if (target._originalFields.has(p)) {
                return target._originalFields.get(p).value;
            }

            if (typeof p !== 'string') {
                return null;
            }

            if (p.startsWith('original_') && !Reflect.has(target, p.replace('original_', '')) && target._originalFields.has(p.replace('original_', ''))) {
                return target._originalFields.get(p.replace('original_', '')).originalValue;
            }
            return null;
        },

        set(target: any, p: string | symbol, value: any, receiver: any): boolean {
            if (Reflect.has(target, p)) {
                return Reflect.set(target, p, value);
            }

            if (target._originalFields.has(p)) {
                target._originalFields.get(p).value = value;
                return true;
            }

            if (p.startsWith('_') && target._originalFields.has(p.replace('_', ''))) {
                const myField = target._originalFields.get(p.replace('_', ''));
                myField._value = value;
                return true;
            }

            return true;
        }
    });
}
