import {Database, Store} from "../dist/jeloquent";

import {User, UserAddress, Avatar, Team, Comment} from "./Models";

test('tables can be added or dropped', () => {
    const store = new Store();
    const database = new Database('defaultDb', [Team, User, UserAddress, Avatar, Comment]);
    store.add(database);
    store.use('defaultDb');

    expect(database.showTables().length).toStrictEqual(5);
    expect(database.name).toStrictEqual('defaultDb');
    expect(database.showTables()).toContain('Team');
    expect(database.showTables()).toContain('User');
    expect(database.showTables()).toContain('UserAddress');
    expect(database.showTables()).toContain('Avatar');
    expect(database.showTables()).toContain('Comment');

    database.drop('User');
    expect(database.showTables().length).toStrictEqual(4);
    expect(database.showTables()).not.toContain('User');
    expect(database.showTables()).toContain('Team');
});