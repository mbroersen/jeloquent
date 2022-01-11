import Collection from "./Store/Collection";
import {Model} from "./Store/Model";
import Table from "./Store/Table";
import Field from "./Store/Model/Field";


export interface ModelStaticInterface {

    get className(): string;
    get snakeCaseClassName(): string;
    get kebabCaseClassName(): string;

    all(): Collection;
    aSyncInsert(data: object): Promise<Collection>;
    delete(id: string|number);
    find(id: object|string|number|Array<string|number>):Collection|ModelInterface|null;
    getIndexByKey(indexName: string);
    getInstance(): ModelInterface;
    ids():Array<string|number>;
    insert(data: object): ModelInterface;
    registerIndex(name: string): void;
    update(data: object): ModelInterface;
}


export interface ModelInterface {
    _tmpId: string;

    fill(data: object): void;
    fillRelations(data: object): void;

    tableSetup(table: Table):void;

    get className(): string;
    get dirtyFields():Array<Field>

    get primaryKey(): string|number|null;
    get primaryKeyName(): Array<string>;

    get kebabCaseClassName(): string;
    get snakeCaseClassName(): string;
}

export interface Indexable {
    setupIndexes(): void;
    addIndex(indexName: string, lookUpKey: string, id: string|number): void;
    removeIndex(indexName: string, lookUpKey: string, id: string|number):void;
    getIndexByKey(indexName: string): Map<string|number, Set<string|number>>
    registerIndex(indexName:string): void;
    get indexes(): Map<string, Map<string|number, Set<string|number>>>;
    get models(): Map<string|number, ModelInterface>
}

export interface Truncateable {
    truncate():void;
}

export interface ApiInterface {
    all(): Collection;
    delete(id:number|string);
    find(id:number|string|object|Array<string|number|object>): Collection|ModelInterface|null;
    insert(model: ModelInterface): void;
    select(id:number|string): Collection|ModelInterface|null;
    update(model: ModelInterface): void;
}

export interface TableInterface extends ApiInterface, Indexable, Truncateable {
    name:string;

    get ids(): Array<string|number>;
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

    ids(tableName:string): Array<string|number>;
    insert(tableName:string, model: ModelInterface): void;
    update(tableName:string, model: ModelInterface): void;
    delete(tableName:string, id:number|string);
    find(tableName:string, id:number|string|Array<string|number>):Collection|Model|null;
    all(tableName:string): CollectionInterface;
    select(tableName:string, id:number|string): ModelInterface;

    indexes(table:string): Map<string, Map<string|number, Set<string|number>>>;
}


export interface ConnectionInterface {
    processQueue(): void
}

export interface IndexInterface extends Truncateable {
    register(indexName: string): void;

    addValueByModel(model: ModelInterface): void;
    removeValueByModel(model: ModelInterface): void;

    getIndexByKey(key: string): Map<string|number, Set<string|number>>
}

export interface CollectionInterface {
    pluck(field:string, keyField:string): Array<ModelInterface>
}



export interface AdapterInterface {
    connectionSettings: AdapterSettings;

    load(model: ModelInterface): Promise<QueueAble>

    all(model: ModelInterface): Promise<QueueAble>

    get(model: ModelInterface): Promise<QueueAble>

    put(model: ModelInterface): Promise<QueueAble>

    patch(model: ModelInterface): Promise<QueueAble>

    post(model: ModelInterface): Promise<QueueAble>

    delete(model: ModelInterface): Promise<QueueAble>
}

export interface AdapterSettings {
    getSettings(): object;
}

export interface QueueAble {
    execute(): void;

    addCallback(callback: CallableFunction);
}


