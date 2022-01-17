import Field from "../../Store/Model/Field";
import Relation from "../../Store/Model/Relation";

export default function (model, fromRelation = false) {
    const json = {};

    for (let i = 0; i < model.originalFields.length; i++) {
        const field = model.originalFields[i];
        if (field instanceof Relation && fromRelation) {
            continue
        }
        json[field.name] = field?.value;
        if (Array.isArray(json[field.name])) {
            json[field.name] = arrayToObjects(json, field);
        }
    }

    return {...json};
}

function arrayToObjects(json: object, field: Field): Array<unknown> {
    return [...json[field.name].map((value) => {
        return (value?.toObject(true) ?? value)
    }) ?? []];
}