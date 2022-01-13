import {Database, Store} from "../src/Jeloquent";

import {User, UserAddress, Avatar, Team, Comment} from "./Models";

test('tables can be added or dropped', () => {
    const store = new Store();
    const database = new Database('defaultDb', [Team, User, UserAddress, Avatar, Comment]);
    store.add(database);
    store.use('defaultDb');

    for (const tableName of database.showTables()) {
        expect(['Team', 'User', 'UserAddress', 'Avatar', 'Comment']).toContain(tableName);
    }


    database.drop('User');
    for (const tableName of database.showTables()) {
        expect(['Team', 'UserAddress', 'Avatar', 'Comment']).toContain(tableName);
    }
});