import QueueMessage from '../Queue/QueueMessage.js';
import {Connection, CollectionInterface, ModelInterface} from "../../../JeloquentInterfaces";

/**
 *
 */
export default class LocalArrayAdapter implements Connection.AdapterInterface {
    connectionSettings: Connection.AdapterSettings;
    options:Array<any>

    constructor (connectionSettings: Connection.AdapterSettings) {
        this.connectionSettings = connectionSettings;
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

    all(model: ModelInterface | CollectionInterface): Promise<QueueMessage> {
        return Promise.resolve(undefined);
    }

    delete(model: ModelInterface | CollectionInterface): Promise<QueueMessage> {
        return Promise.resolve(undefined);
    }

    get(model: ModelInterface | CollectionInterface): Promise<QueueMessage> {
        return Promise.resolve(undefined);
    }

    patch(model: ModelInterface | CollectionInterface): Promise<QueueMessage> {
        return Promise.resolve(undefined);
    }

    post(model: ModelInterface | CollectionInterface): Promise<QueueMessage> {
        return Promise.resolve(undefined);
    }

    put(model: ModelInterface | CollectionInterface): Promise<QueueMessage> {
        return Promise.resolve(undefined);
    }
}