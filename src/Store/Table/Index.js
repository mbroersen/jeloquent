import {ForeignKey, Relation} from "../Model";

export default class Index {

    static registerIndex(model, name)
    {
        globalThis.Store.database().registerIndex(model.constructor.className(), name);
    }

    static addIndex(model, foreignKeyField)
    {
        globalThis.Store.database().addIndex(model.className, foreignKeyField.foreignKey, foreignKeyField.fieldValue, model.primaryKey);
    }

    static updateAllDirtyIndexes(model) {
        let className = model.className;
        model.dirtyFields.filter(field => field instanceof ForeignKey).forEach((field) => {
            globalThis.Store.database().removeIndex(className, field.$name, field.previousValue, model.primaryKey);
            globalThis.Store.database().addIndex(className, field.$name, field.value, model.primaryKey);
        });
    }

    static removeTmpIdFromIndex(model) {
        let className = model.className;
        model.dirtyFields.filter(field => field instanceof ForeignKey).forEach((field) => {
            globalThis.Store.database().removeIndex(className, field.$name, field.previousValue, model._tmpId);
        });
    }

    static removeIndex(model, foreignKeyField)
    {
        globalThis.Store.database().removeIndex(model.className, foreignKeyField.foreignKey, foreignKeyField.previousValue, model.primaryKey);
    }

    static removeIndexLookUpKey()
    {

    }

}