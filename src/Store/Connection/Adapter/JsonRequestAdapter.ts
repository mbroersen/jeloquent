import QueueMessage from '../Queue/QueueMessage.js';
import ConnectionRequest from "../ConnectionRequest";
import {AdapterInterface, AdapterSettings, ModelInterface} from "../../../JeloquentInterfaces";

/**
 *
 */
export default class JsonRequestAdapter implements AdapterInterface {

    connectionSettings: AdapterSettings;

    constructor (connectionSettings: AdapterSettings) {
        this.connectionSettings = connectionSettings;
    }

    get isLocal(): boolean {
        return false;
    }

    get isRemote(): boolean {
        return true;
    }

    all(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
                .all(model)
                .then(response => this.responseJson(response))
                .then(data => {
                    const message = new QueueMessage(model, 'insert', data);
                    resolve(message);
                });
        }));
    }

    delete(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
                .delete(model)
                .then(response => this.responseJson(response))
                .then(data => {
                    const message = new QueueMessage(model, 'delete', data);
                    resolve(message);
                });
        }));
    }

    get(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
                .get(model)
                .then(response => this.responseJson(response))
                .then(data => {
                    const message = new QueueMessage(model, 'fill', data);
                    resolve(message);
                });
        }))
    }

    load(model: ModelInterface): Promise<QueueMessage> {
        return this.all(model);
    }

    patch(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
                .patch(model)
                .then(response => this.responseJson(response))
                .then(data => {
                    const message = new QueueMessage(model, 'fill', data);
                    resolve(message);
                });
        }));
    }

    post(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
                .post(model)
                .then(response => this.responseJson(response))
                .then(data => {
                    const message = new QueueMessage(model, 'fill', data);
                    resolve(message);
                });
        }))
    }

    put(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve => {
            new ConnectionRequest(this.connectionSettings)
                .put(model)
                .then(response => this.responseJson(response))
                .then(data => {
                    const message = new QueueMessage(model, 'fill', data);
                    resolve(message);
                });
        }));
    }

    /**
     *
     * @param {Response} response
     */
    responseJson(response) {
        return response.json();
    }
}