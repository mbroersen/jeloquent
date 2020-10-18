import {Collection, Model, Field, Store, Database, Connection, ConnectionAdapter, QueueMessage} from "../dist/jeloquent";

test('Store can add database', () => {
    const store = new Store();
    const database = new Database('default', []);
    store.add(database);
    store.use('default');

    expect(store.database()).toBeInstanceOf(Database);
    store.use('none');
    expect(store.database()).toStrictEqual(null);
});



test('Store can load dataset through connection adapter', async () => {

    class MockAdapter extends ConnectionAdapter {
        constructor(options) {
            super(options);
        }

        load(model) {
            return new Promise((resolve) => {
                const modelData = [
                    {id: 1, name: 'test'},
                    {id: 2, name: 'test 2'},
                    {id: 3, name: 'test 3'},
                    {id: 4, name: 'test 4'},
                    {id: 5, name: 'test 5'},
                    {id: 6, name: 'test 6'},
                ];
                const message = new QueueMessage(model, 'insert', modelData);
                resolve(message);
            });
        }
    }

    class User extends Model {
        constructor() {
            const fields = [
                new Field('id', true),
                new Field('name')
            ]
            super(fields);
        }
    }

    const store = new Store();
    const database = new Database('default', [User]);
    const connection = new Connection(new MockAdapter());
    store.add(database);
    store.addConnections(connection);
    store.use('default');
    await store.connection().load(User);

    expect(User.all().length).toStrictEqual(6);
});

