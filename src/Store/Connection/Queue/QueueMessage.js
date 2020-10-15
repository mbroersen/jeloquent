export default class QueueMessage {

    constructor(model, action, data) {
        this.model = model;
        this.action = action;
        this.data = data;
    }

    execute() {
        this.model[this.action](this.data);
    }
}