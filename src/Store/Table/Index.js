import {ForeignKey} from "../Model";

/**
 *
 */
export default class Index {

    /**
     *
     * @param model
     * @param name
     */
    static registerIndex(model, name) {
        globalThis.Store.database().registerIndex(model.constructor.className(), name);
    }

    /**
     *
     * @param model
     * @param foreignKeyField
     */
    static addIndex(model, foreignKeyField) {
        globalThis.Store.database().addIndex(model.className, foreignKeyField.foreignKey, foreignKeyField.fieldValue, model.primaryKey);
    }

    /**
     *
     * @param model
     */
    static updateAllDirtyIndexes(model) {
        let className = model.className;
        model.dirtyFields.filter(field => field instanceof ForeignKey).forEach((field) => {
            globalThis.Store.database().removeIndex(className, field.$name, field.previousValue, model.primaryKey);
            globalThis.Store.database().addIndex(className, field.$name, field.value, model.primaryKey);
        });
    }

    /**
     *
     * @param model
     */
    static removeTmpIdFromIndex(model) {
        let className = model.className;
        model.dirtyFields.filter(field => field instanceof ForeignKey).forEach((field) => {
            globalThis.Store.database().removeIndex(className, field.$name, field.previousValue, model._tmpId);
        });
    }

    /**
     *
     * @param model
     * @param foreignKeyField
     */
    static removeIndex(model, foreignKeyField) {
        globalThis.Store.database().removeIndex(model.className, foreignKeyField.foreignKey, foreignKeyField.previousValue, model.primaryKey);
    }

    /**
     *
     */
    static removeIndexLookUpKey() {

    }
}