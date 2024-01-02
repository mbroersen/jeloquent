import Collection from "./Store/Collection";
import Table from "./Store/Table";
import Field from "./Store/Model/Field";


export interface ModelStaticInterface {

    aSyncInsert(data): Promise<Collection>;
    aSyncUpdate(data): Promise<Collection>;

    all(): Collection;

    get className(): string;

    delete(id: string|number);
    find(id: object|string|number|Array<string|number>):Collection|ModelInterface|null;

    getIndexByKey(indexName: string);
    getInstance(): ModelInterface;

    ids():Array<string>;
    insert(data: object): ModelInterface;

    get kebabCaseClassName(): string;

    registerIndex(name: string): void;

    get snakeCaseClassName(): string;

    update(data: object): ModelInterface;
}


export interface ModelInterface {
    _originalFields: Map<string, Field>;
    _tmpId: string;

    get className(): string;
    get dirtyFields():Array<Field>

    fill(data: object): void;
    fillRelations(data: object): void;

    get kebabCaseClassName(): string;

    get primaryKey(): string|null;
    get primaryKeyName(): Array<string>;

    get snakeCaseClassName(): string;

    tableSetup(table: Table):void;
}

export interface Indexable {
    addIndex(indexName: string, lookUpKey: string, id: string|number): void;

    getIndexByKey(indexName: string): Map<string|number, Set<string|number>>

    get indexes(): Map<string, Map<string|number, Set<string|number>>>;

    get models(): Map<string|number, ModelInterface>

    registerIndex(indexName:string): void;
    removeIndex(indexName: string, lookUpKey: string, id: string|number):void;

    setupIndexes(): void;



}

export interface Truncateable {
    truncate():void;
}

export interface ApiInterface {
    all(): Collection;
    delete(id:number|string);
    find(id:number|string|object|Array<string|number|object>): Collection|ModelInterface|null;
    insert(model: ModelInterface): void;
    update(model: ModelInterface): void;
}

export interface TableInterface extends ApiInterface, Indexable, Truncateable {
    name:string;

    get ids(): Array<string|number>;
}



export interface StoreInterface {
    add(database:DatabaseInterface):void;
    addConnection(connection: ConnectionInterface, name: string): void;

    connection(): ConnectionInterface|null;
    database(): DatabaseInterface|null;

    use(storeName:string):void;
    useConnection(connectionName:string):void;
}

export interface DatabaseInterface {
    all(tableName:string): Collection;

    delete(tableName:string, id:number|string);

    find(table:string, id:number|string|object|Array<string|number|object>): Collection|ModelInterface|null

    ids(tableName:string): Array<string|number>;

    indexes(table:string): Map<string, Map<string, Set<string>>>;

    insert(tableName:string, model: ModelInterface): void;

    get name(): string;

    save(tableName:string, data:object);

    setIndexes():void;

    update(tableName:string, model: ModelInterface): void;
}


export interface ConnectionInterface {
    processQueue(): void
}

export interface IndexInterface extends Truncateable {
    addValueByModel(model: ModelInterface): void;

    getIndexByKey(key: string): Map<string|number, Set<string|number>>

    register(indexName: string): void;

    removeValueByModel(model: ModelInterface): void;
}

export interface CollectionInterface {
    pluck(field:string, keyField:string): Array<ModelInterface>
}



export interface AdapterInterface {
    connectionSettings: AdapterSettings;

    all(model: ModelStaticInterface): Promise<QueueAble>

    delete(model: ModelInterface): Promise<QueueAble>

    get(model: ModelInterface): Promise<QueueAble>

    load(model: ModelStaticInterface): Promise<QueueAble>

    patch(model: ModelInterface): Promise<QueueAble>

    post(model: ModelInterface): Promise<QueueAble>

    put(model: ModelInterface): Promise<QueueAble>
}

export interface AdapterSettings {
    getSettings(): object;
}

export interface AdapterSettingsOptions {
    baseUrl: string;
    cache: string;
    contentType: string;
    headers: object;
    mode: string;
    modelPathMappings: Map<string, string>;
}

export interface QueueAble {

    addCallback(callback: CallableFunction);

    execute(): void;
}


