import ConnectionAdapter from '../ConnectionAdapter.js';
import QueueMessage from '../Queue/QueueMessage.js';

export default class ConnectionAdapterLocalArray extends ConnectionAdapter {

    constructor(options) {
        super(options);
    }

    load(model) {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'aSyncInsert', this.getTableFromLocalStorage(model)));
        })
    }

    getLocalStorageKey(model) {
        return `jeloquent-${Store.use}-${model.className}`;
    }

    getTableFromLocalStorage(model) {
        return JSON.parse(localStorage.getItem(this.getLocalStorageKey(model)) ?? '[]');
    }

    /**
     *
     * @param model
     * @param data
     */
    post(model, data) {
        localStorage.setItem(this.getLocalStorageKey(model), JSON.stringify(data));
    }
}