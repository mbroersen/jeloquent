import {Database, Store} from "../dist/jeloquent";

import {User, UserAddress, Avatar, Team, Comment} from "./Models";

test('tables can be added or dropped', () => {
    const store = new Store();
    const database = new Database('defaultDb', [Team, User, UserAddress, Avatar, Comment]);
    store.add(database);
    store.use('defaultDb');

    for (let tableName of database.showTables()) {
        expect(['Team', 'User', 'UserAddress', 'Avatar', 'Comment']).toContain(tableName);
    };


    database.drop('User');
    for (let tableName of database.showTables()) {
        expect(['Team', 'UserAddress', 'Avatar', 'Comment']).toContain(tableName);
    };
});