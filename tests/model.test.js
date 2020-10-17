import {Collection} from "../dist/jeloquent";
import {User, testStore} from "./Models";


User.insert({id: 12});

test('Simpel model setup', () => {
    const lUser = new User();

    expect(lUser.primaryKeyName).toStrictEqual(["id"]);
    expect(lUser.id).toStrictEqual(null);
    expect(lUser._tmpId).toStrictEqual('_6');
});

test('User can be found', () => {
    const lUser = User.find(12);
    const cUser = User.find([12]);
    const allUsers = User.all();

    expect(lUser).toBeInstanceOf(User);
    expect(lUser.primaryKey).toBe("12");
    expect(allUsers).toBeInstanceOf(Collection);
    expect(cUser).toBeInstanceOf(Collection);
    expect(allUsers.length).toBe(1);
    expect(allUsers[0].id).toBe(12);
})


test('Model returns classNames', () => {
    expect(User.className()).toStrictEqual("User");
    expect(User.kebabCaseClassName()).toStrictEqual("user");
    expect(User.snakeCaseClassName()).toStrictEqual("user");
});

test('Model fetch all primaryKeys', () => {
    const indexes = User.ids();
    expect(indexes).toStrictEqual(["12"]);
    testStore.database().truncate('User');
    expect(User.ids()).toStrictEqual([]);
});