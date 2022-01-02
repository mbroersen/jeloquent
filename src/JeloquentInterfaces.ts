

export interface ModelInterface {
    primaryKeyName: Array<string>;

    model: ModelInterface;
    name: string;
    index: IndexInterface;
    primaryKeyFieldNames: Array<string>;
    models: Map<string, ModelInterface>;

    getInstance(): ModelInterface;

    get primaryKey(): string|null;
    get className(): string;
    get kebabCaseName(): string;
    //get kebabCaseName(): String
    //get kebabCaseName(): String
}

export interface TableInterface {
    model:ModelInterface;
    name:string;
    index: IndexInterface;
    primaryKeyFieldNames: Array<string>;
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
    processQueue(): void
}

export interface IndexInterface {
    register(model:ModelInterface, indexName: string): void;
}

export interface CollectionInterface {
    pluck(field:string, keyField:string): Array<ModelInterface>
}

export namespace Connection {

    export interface AdapterInterface {
        connectionSettings: AdapterSettings;

        load(model: ModelInterface): Promise<QueueMessage>

        all(model: ModelInterface): Promise<QueueMessage>

        get(model: ModelInterface): Promise<QueueMessage>

        put(model: ModelInterface): Promise<QueueMessage>

        patch(model: ModelInterface): Promise<QueueMessage>

        post(model: ModelInterface): Promise<QueueMessage>

        delete(model: ModelInterface): Promise<QueueMessage>
    }

    export interface AdapterSettings {
        getSettings(): object;
    }


    export interface QueueMessage {
        execute(): void;
    }
}

