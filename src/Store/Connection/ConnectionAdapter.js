export default class ConnectionAdapter {
    constructor(options) {
        this.options = options;
    }

    /**
     *
     * @param model
     * @return Promise
     */
    load(model) {
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

