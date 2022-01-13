import QueueMessage from '../Queue/QueueMessage';
import {AdapterInterface, AdapterSettings, ModelInterface, ModelStaticInterface} from "../../../JeloquentInterfaces";

/**∂
 *
 */
export default class LocalArrayAdapter implements AdapterInterface {
    connectionSettings: AdapterSettings;

    options:object;

    constructor (connectionSettings: AdapterSettings) {
        this.connectionSettings = connectionSettings;
    }

    all(model: ModelStaticInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className]));
        });
    }

    delete(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className]));
        });
    }

    get(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className]));
        });
    }

    /**
     *
     * @param model
     * @return {Promise<unknown>}
     */
    load(model:ModelStaticInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className]));
        });
    }

    patch(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className]));
        });
    }

    post(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className]));
        });
    }

    put(model: ModelInterface): Promise<QueueMessage> {
        return new Promise((resolve) => {
            resolve(new QueueMessage(model, 'insert', this.options[model.className]));
        });
    }
}