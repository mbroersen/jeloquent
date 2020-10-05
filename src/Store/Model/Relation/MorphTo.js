import Relation from "../Relation";

export default class MorphTo extends Relation {

    constructor(model) {
        const className = model.className();
        const foreignKey = `${className}_id-${className}_type`; //should be avatar_type-avatar_id
        super(model, foreignKey);
    }
}