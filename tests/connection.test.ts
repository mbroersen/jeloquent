import {Connection, ConnectionAdapterFactory, ConnectionSettings} from "../src/Jeloquent";
import {User, Team, testStore} from "./Models";

test('test if we can use connection to fill user model', () => {
    global.fetch = jest.fn((url) => {
        expect(
            'http://localhost/user',
        ).toBe(url);

        return Promise.resolve({
            json: () => Promise.resolve([
                {id: 1, name: 'test'},
                {id: 2, name: 'test 1'},
                {id: 3, name: 'test 2'},
                {id: 4, name: 'test 3'},
                {id: 5, name: 'test 4'},
            ]),
        });
    });

    testStore.addConnection(
        new Connection(
            ConnectionAdapterFactory.getAdapter('jsonRequest', new ConnectionSettings({
                baseUrl: 'http://localhost'
            }))
        )
    );

    (async () => {
        await testStore.connection().all(User);
        expect(User.all().length).toBe(5);
    })();


});

test('test if we can use connection to fill team model', () => {
    global.fetch = jest.fn((url) => {
        expect(
            'http://localhost/team',
        ).toBe(url);

        return Promise.resolve({
            json: () => Promise.resolve([
                {id: 1, name: 'test'},
                {id: 2, name: 'test 1'},
                {id: 3, name: 'test 2'},
                {id: 4, name: 'test 3'},
                {id: 5, name: 'test 4'},
            ]),
        });
    });

    testStore.addConnection(
        new Connection(
            ConnectionAdapterFactory.getAdapter('jsonRequest', new ConnectionSettings())
        )
    );

    (async () => {
        await testStore.connection().all(Team);
        expect(Team.all().length).toBe(5);
    })();
});

test('test if we can use connection with change of the endpoint of a model', () => {
    global.fetch = jest.fn((url) => {
        expect(
            'http://test.com/api/teams',
        ).toBe(url);

        return Promise.resolve({
            json: () => Promise.resolve([
                {id: 1, name: 'test'},
                {id: 2, name: 'test 1'},
                {id: 3, name: 'test 2'},
                {id: 4, name: 'test 3'},
                {id: 5, name: 'test 4'},
            ]),
        });
    });

    const baseUrl = 'http://test.com';
    const modelPathMappings = new Map();
    modelPathMappings.set(Team.className, 'api/teams');

    testStore.addConnection(
        new Connection(
            ConnectionAdapterFactory.getAdapter('jsonRequest',
                new ConnectionSettings(
                    {
                        baseUrl,
                        modelPathMappings
                    }
                )
            )
        )
    );

    testStore.database().truncate('Team');
    (async () => {
        await testStore.connection().all(Team);
        expect(Team.all().length).toBe(5);
    })();
});
