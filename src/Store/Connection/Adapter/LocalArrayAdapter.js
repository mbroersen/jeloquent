import ConnectionAdapter from '../ConnectionAdapter.js';
import QueueMessage from '../Queue/QueueMessage.js';

/**
 *
 */
export default class LocalArrayAdapter extends ConnectionAdapter {
    /**
     *
     * @param options
     */
    constructor(options) {
        super(options);
    }

    /**
     *
     * @param model
     * @return {Promise<unknown>}
     */
    load(model) {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className()]));
        });
    }
}