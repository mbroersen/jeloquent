export interface ModelInterface {
    className: string;
    primaryKeyName: Array<string>;

    model: ModelInterface;
    name: string;
    index: IndexInterface;
    primaryKeyFieldNames: Array<string>;
    models: Map<string, ModelInterface>;

    getInstance(): ModelInterface;

    hello: string;
    get kebabCaseName(): String
    //get kebabCaseName(): String
    //get kebabCaseName(): String
}

export interface TableInterface {
    model:ModelInterface;
    name:string;
    index: IndexInterface;
    primaryKeyFieldNames:Array<string>;
    models: Map<string, ModelInterface>;

    setupIndexes(): void;
    registerIndex(indexName:string): void;
}



export interface StoreInterface {
    use(storeName:String):void;
    useConnection(connectionName:string):void;
    add(database:DatabaseInterface):void;
    addConnection(connection: ConnectionInterface, name: string): void;

    connection(): ConnectionInterface|null;
    database(): DatabaseInterface|null;

}

export interface DatabaseInterface {
    name: string;
    setIndexes():void;
}


export interface ConnectionInterface {

}

export interface IndexInterface {

}

export interface CollectionInterface {

}

export namespace Connection {

    export interface AdapterInterface {
        connectionSettings: AdapterSettings;

        load(model: ModelInterface | CollectionInterface): Promise<QueueMessage>

        all(model: ModelInterface | CollectionInterface): Promise<QueueMessage>

        get(model: ModelInterface | CollectionInterface): Promise<QueueMessage>

        put(model: ModelInterface | CollectionInterface): Promise<QueueMessage>

        patch(model: ModelInterface | CollectionInterface): Promise<QueueMessage>

        post(model: ModelInterface | CollectionInterface): Promise<QueueMessage>

        delete(model: ModelInterface | CollectionInterface): Promise<QueueMessage>
    }

    export interface AdapterSettings {

    }


    export interface QueueMessage {

    }
}
