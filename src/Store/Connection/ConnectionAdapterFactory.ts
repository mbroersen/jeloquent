import JsonRequestAdapter from "./Adapter/JsonRequestAdapter";
import LocalStorageAdapter from "./Adapter/LocalStorageAdapter";
import LocalArrayAdapter from "./Adapter/LocalArrayAdapter";
import ConnectionSettings from "./ConnectionSettings";
import {AdapterInterface} from "../../JeloquentInterfaces";

class ConnectionAdapterFactory {
    static getAdapter (name: string, connectionSettings: ConnectionSettings): AdapterInterface {
        if (name === 'jsonRequest') {
            return new JsonRequestAdapter(connectionSettings);
        }

        if (name === 'localStorage') {
            return new LocalStorageAdapter(connectionSettings);
        }

        if (name === 'localArray') {
            return new LocalArrayAdapter(connectionSettings);
        }

        return new JsonRequestAdapter(connectionSettings);
    }
}

export {
    ConnectionAdapterFactory,
    LocalStorageAdapter,
    LocalArrayAdapter,
    JsonRequestAdapter
}