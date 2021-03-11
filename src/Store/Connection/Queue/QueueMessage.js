/**
 *
 */
export default class QueueMessage {

    /**
     *
     * @param model
     * @param action
     * @param data
     */
    constructor(model, action, data) {
        this.model = model;
        this.action = action;
        this.data = data;
    }

    /**
     *
     * @param {function} callback
     */
    addCallback(callback) {
        this.callback = callback;
    }

    /**
     *
     */
    execute() {
        this.model[this.action](this.data);
        (this.callback ?? (() => {}))();
    }
}