import Collection from "./Store/Collection";
import {Model} from "./Store/Model";


export interface ModelInterface extends ApiInterface {
    primaryKeyName: Array<string>;

    model: ModelInterface;
    name: string;
    index: IndexInterface;
    primaryKeyFieldNames: Array<string>;
    models: Map<string, ModelInterface>;

    getInstance(): ModelInterface;
    fill(data: object): void;
    fillRelations(data: object): void;

    get primaryKey(): string|null;
    get className(): string;
    get kebabCaseName(): string;
    //get kebabCaseName(): String
    //get kebabCaseName(): String
}

export interface Indexable {
    setupIndexes(): void;
    addIndex(indexName: string, lookUpKey: string, id: string|number): void;
    removeIndex(indexName: string, lookUpKey: string, id: string|number):void;
    getIndexByKey(indexName: string): Map<string, Set<string>>
    registerIndex(indexName:string): void;
    get indexes(): Map<string, Map<string, Set<string>>>;
}

export interface Truncateable {
    truncate():void;
}

export interface ApiInterface {
    insert(model: ModelInterface): void;
    update(model: ModelInterface): void;
    delete(id:number|string);
    find(id:number|string|Array<string|number>):Collection|Model|null;
    all(): CollectionInterface;
    select(id:number|string): ModelInterface;
}

export interface TableInterface extends ApiInterface, Indexable, Truncateable {
    model:ModelInterface;
    name:string;
    index: IndexInterface;
    primaryKeyFieldNames: Array<string>;
    models: Map<string, ModelInterface>;

    get ids(): Array<string|number>;
    allModels(): Map<string, ModelInterface>;
}



export interface StoreInterface {
    use(storeName:string):void;
    useConnection(connectionName:string):void;
    add(database:DatabaseInterface):void;
    addConnection(connection: ConnectionInterface, name: string): void;

    connection(): ConnectionInterface|null;
    database(): DatabaseInterface|null;
}

export interface DatabaseInterface {
    get name(): string;

    setIndexes():void;
    ids(tableName:string): Array<string>;

}


export interface ConnectionInterface {
    processQueue(): void
}

export interface IndexInterface extends Truncateable {
    register(indexName: string): void;
    add():void
    remove(): void;

    addValueByModel(model: ModelInterface): void;
    removeValueByModel(model: ModelInterface): void;

    getIndexByKey(key: string): Map<string|number, Set<string|number>>
    _indexes(): Map<string, Map<string, Set<string>>>
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

