import ConnectionAdapterJsonRequest from "./Adapter/ConnectionAdapterJsonRequest";

class ConnectionAdapter {
    constructor(options) {
        this.options = options;
    }

    /**
     *
     * @param model
     * @param filter
     * @return Promise
     */
    load(model, filter) {
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

export {
    ConnectionAdapter,
    ConnectionAdapterJsonRequest,
}