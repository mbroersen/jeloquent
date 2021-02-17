import ConnectionAdapter from '../ConnectionAdapter.js';
import QueueMessage from '../Queue/QueueMessage.js';

/**
 *
 */
export default class ConnectionAdapterJsonRequest extends ConnectionAdapter {

    /**
     *
     * @param options
     */
    constructor(options) {
        super(options);
    }

    /**
     *
     * @return {boolean}
     */
    get isRemote() {
        return true;
    }

    /**
     *
     * @return {boolean}
     */
    get isLocal() {
        return false;
    }

    /**
     *
     * @param model
     * @return {Promise<unknown>}
     */
    load(model) {
        const promise = new Promise((resolve) => {
            const method = this.options.method ?? 'GET';
            const url = `${this.options.url}/${model.kebabCaseClassName()}`;
            const formatter = this.options?.formatter ?? ((data) => data);

            const request = new XMLHttpRequest();
            request.open(method, url, true);
            request.addEventListener('load', () => {
                if (request.readyState == 4) {
                    const modelData = formatter(JSON.parse(request.responseText));
                    const message = new QueueMessage(model, 'insert', modelData);
                    resolve(message);
                }
            })
            request.send(null);
        });

        return promise;
    }
}