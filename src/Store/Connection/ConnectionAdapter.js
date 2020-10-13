
export default class ConnectionAdapter {
    constructor(options) {
        this.options = options;
    }

    /**
     *
     * @param Model
     * @return QueueMessage
     */
    load(Model) {
        throw new Error('should be extended');
    }

    put() {
        throw new Error('should be extended');
    }

    patch() {
        throw new Error('should be extended');
    }

    post() {
        throw new Error('should be extended');
    }

    delete() {
        throw new Error('should be extended');
    }
}