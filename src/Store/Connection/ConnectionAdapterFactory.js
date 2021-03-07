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
     * @param {String} name
     * @param {ConnectionSettings} connectionSettings
     * @return {ConnectionAdapterLocalArray|ConnectionAdapterJsonRequest|ConnectionAdapterLocalStorage}
     */
    static getAdapter (name, connectionSettings) {

        if (name === 'jsonRequest') {
            return new ConnectionAdapterJsonRequest(connectionSettings);
        }

        if (name === 'localStorage') {
            return new ConnectionAdapterLocalStorage(connectionSettings);
        }

        if (name === 'localArray') {
            return new ConnectionAdapterLocalArray(connectionSettings);
        }

        return new ConnectionAdapterJsonRequest(connectionSettings);
    }
}

export {
    ConnectionAdapterFactory,
    ConnectionAdapterLocalStorage,
    ConnectionAdapterLocalArray,
    ConnectionAdapterJsonRequest,
    ConnectionAdapter
}