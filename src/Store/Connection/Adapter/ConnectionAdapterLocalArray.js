import ConnectionAdapter from '../ConnectionAdapter.js';
import QueueMessage from '../Queue/QueueMessage.js';

export default class ConnectionAdapterLocalArray extends ConnectionAdapter {

    constructor(options) {
        super(options);
    }

    load(model) {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className()]));
        });
    }
}