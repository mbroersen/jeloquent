import ConnectionAdapter from '../ConnectionAdapter.js';
import QueueMessage from '../Queue/QueueMessage.js';

/**
 *
 */
export default class ConnectionAdapterLocalArray extends ConnectionAdapter {

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
            resolve(new QueueMessage(model, 'aSyncInsert', this.getTableFromLocalStorage(model)));
        })
    }

    /**
     *
     * @param model
     * @return {string}
     */
    getLocalStorageKey(model) {
        return `jeloquent-${globalThis.Store.use}-${model.className}`;
    }

    /**
     *
     * @param model
     * @return {any}
     */
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