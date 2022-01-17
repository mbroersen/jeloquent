import Relation from "../Relation";
import ForeignKey from "../Field/ForeignKey";
import HasManyThrough from "../Relation/HasManyThrough";


export function addRelationFieldsToList(fields) {
    const fieldList = [...fields];
    fields.forEach((field, i) => {
        if (field instanceof Relation) {
            fieldList.splice(i, 0, ...field.getRelationalFields());
        }
    });
    return fieldList;
}

export function setFields(model, fields) {
    model._originalFields = [...fields];
    model.numberOfFields = model.originalFields.length;
    for (let i = 0; i < model.numberOfFields; i++) {
        model.originalFields[i].setup(model);
    }
}

export function setupTable(model, table) {
    for (let i = 0; i < model.numberOfFields; i++) {
        if (model.originalFields[i] instanceof ForeignKey) {
            model.originalFields[i].tableSetup(table);
        }

        if (model.originalFields[i] instanceof HasManyThrough) {
            model.originalFields[i].tableSetup(table);
        }
    }
}