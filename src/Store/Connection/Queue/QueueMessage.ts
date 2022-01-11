/**
 *
 */
import {ModelInterface, QueueAble} from "../../../JeloquentInterfaces";

export default class QueueMessage implements QueueAble {

    private action: string;

    private callback: CallableFunction;

    private data: object|Array<object>;

    private model: ModelInterface;

    constructor(model: ModelInterface, action: string, data:object|Array<object>) {
        this.model = model;
        this.action = action;
        this.data = data;
        this.callback = () => null;
    }

    addCallback(callback: CallableFunction): void {
        this.callback = callback;
    }

    execute(): void {
        this.model[this.action](this.data);
        this.callback();
    }
}