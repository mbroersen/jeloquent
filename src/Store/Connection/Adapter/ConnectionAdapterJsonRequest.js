import {ConnectionAdapter} from '../ConnectionAdapter.js';
import QueueMessage from '../Queue/QueueMessage.js';

export default class ConnectionAdapterJsonRequest extends ConnectionAdapter {

    constructor(options) {
        super(options);
    }

    load(model, filter) {
        const promise = new Promise((resolve, reject) => {
            const method = this.options.method ?? 'GET';
            const url = `${this.options.url}/${model.className().toLowerCase()}s`;
            const formatter = this.options.formatter ?? ((data) => data);
            //const data = new FormData();

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