import Field from "./Field.js";

export default class Relation extends Field {

    constructor(model, foreignKey) {
        super(model.className().toLowerCase());
        this.model = model;
        this.foreignKey = foreignKey;
    }
}