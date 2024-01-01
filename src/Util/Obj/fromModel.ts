import Field from "../../Store/Model/Field";
import Relation from "../../Store/Model/Relation";
import MorphTo from "../../Store/Model/Field/MorphTo";

export default function (model, fromRelation = false) {
    const json = {};

    for (let i = 0; i < model.originalFields.length; i++) {
        const field = model.originalFields[i];
        if (field instanceof Relation && fromRelation) {
            continue
        }

        if (field instanceof MorphTo && fromRelation) {
            continue;
        }


        if (Array.isArray(json[field.name])) {
            json[field.name] = arrayToObjects(json, field);
        } else if (field instanceof Relation) {
            json[field.name] = field?.value?.toObject?.(true) ?? null;
        } else {
            json[field.name] = field.value;
        }
    }

    return {...json};
}

function arrayToObjects(json: object, field: Field): Array<unknown> {
    return [...json[field.name].map((value) => {
        return (value?.toObject(true) ?? value)
    }) ?? []];
}