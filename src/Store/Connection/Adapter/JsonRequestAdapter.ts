import QueueMessage from '../Queue/QueueMessage.js';
import ConnectionRequest from "../ConnectionRequest";
import {AdapterInterface, ModelInterface, ModelStaticInterface, QueueAble} from "../../../JeloquentInterfaces";
import ConnectionSettings from "../ConnectionSettings";

/**
 *
 */
export default class JsonRequestAdapter implements AdapterInterface {

    connectionSettings: ConnectionSettings;

    constructor (connectionSettings: ConnectionSettings) {
        this.connectionSettings = connectionSettings;
    }

    get isLocal(): boolean {
        return false;
    }

    get isRemote(): boolean {
        return true;
    }

    all(model: ModelStaticInterface): Promise<QueueAble> {
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

    delete(model: ModelInterface): Promise<QueueAble> {
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

    get(model: ModelInterface): Promise<QueueAble> {
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

    load(model: ModelStaticInterface): Promise<QueueAble> {
        return this.all(model);
    }

    patch(model: ModelInterface): Promise<QueueAble> {
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

    post(model: ModelInterface): Promise<QueueAble> {
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

    put(model: ModelInterface): Promise<QueueAble> {
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