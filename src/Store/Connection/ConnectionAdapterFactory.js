import ConnectionAdapterJsonRequest from "./Adapter/ConnectionAdapterJsonRequest";
import ConnectionAdapterLocalStorage from "./Adapter/ConnectionAdapterLocalStorage";
import ConnectionAdapterLocalArray from "./Adapter/ConnectionAdapterLocalStorage";
import ConnectionAdapter from "./ConnectionAdapter";

/**
 *
 */
class ConnectionAdapterFactory {

    /**
     *
     * @param name
     * @param options
     * @return {ConnectionAdapterLocalArray|ConnectionAdapterJsonRequest}
     */
    static getAdapter (name, options) {

        if (name === 'jsonRequest') {
            return new ConnectionAdapterJsonRequest(options);
        }

        if (name === 'localStorage') {
            return new ConnectionAdapterLocalStorage(options);
        }

        if (name === 'localArray') {
            return new ConnectionAdapterLocalArray(options);
        }

        return new ConnectionAdapterJsonRequest(options);
    }
}

export {
    ConnectionAdapterFactory,
    ConnectionAdapterLocalStorage,
    ConnectionAdapterLocalArray,
    ConnectionAdapterJsonRequest,
    ConnectionAdapter
}