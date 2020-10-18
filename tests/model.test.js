import {Collection} from "../dist/jeloquent";
import {User, UserAddress, testStore, Avatar} from "./Models";


User.insert({id: 12});

Avatar.insert([
    {avatar_id: 12, avatar_type: 'User', img_url: 'http://test.com/test.png'},
    {avatar_id: 12, avatar_type: 'Team', img_url: 'http://test.com/test2.png'},
    {avatar_id: 1, avatar_type: 'Team', img_url: 'http://test.com/test3.png'},
]);

test('Simple model setup', () => {
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

test('Avatar composed primary key can be found', () => {
    const lAvatar = Avatar.find({avatar_id: 12, avatar_type: 'User'});
    expect(lAvatar).toBeInstanceOf(Avatar);

    const lAvatar2 = Avatar.find({avatar_id: 12, avatar_type: 'Team'});
    expect(lAvatar2).toBeInstanceOf(Avatar);

    const lAvatar3 = Avatar.find({avatar_id: 1, avatar_type: 'Team'});
    expect(lAvatar3).toBeInstanceOf(Avatar);

    const lAvatar4 = Avatar.find({avatar_id: 4, avatar_type: 'Team'});
    expect(lAvatar4).toStrictEqual(null);
});

test('Model returns classNames', () => {
    expect(UserAddress.className()).toStrictEqual("UserAddress");
    expect(UserAddress.kebabCaseClassName()).toStrictEqual("user-address");
    expect(UserAddress.snakeCaseClassName()).toStrictEqual("user_address");
});

test('Model fetch all primaryKeys', () => {
    const indexes = User.ids();
    expect(indexes).toStrictEqual(["12"]);
    testStore.database().truncate('User');
    expect(User.ids()).toStrictEqual([]);
});