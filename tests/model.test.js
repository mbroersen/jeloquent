import {Collection} from "../dist/jeloquent";
import {User, UserAddress, testStore, Avatar, Team, Comment} from "./Models";


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
    expect(lUser.primaryKey).toBe(12);
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

    const lAvatar5 = Avatar.find('12-Team');
    expect(lAvatar5).toBeInstanceOf(Avatar);

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

test('Insert relations via model', () => {
    testStore.database().truncate('User');
    testStore.database().truncate('Team');
    testStore.database().truncate('Avatar');
    testStore.database().truncate('Comment');

    User.insert({
        id: 1, name: 'user 1', team_id: 1,
        team: {id: 1, name: 'team relation 1'},
        user_address: {id: 22, city: 'Hoorn', steet: 'waagplein', house_number: 1, user_id: 1},
        avatar: {avatar_type: 'User', avatar_id: 1, img_url: 'team.png'},
        comments: [
            {id: 9, title: 'titel', text: 'hoi', user_id: 1},
            {id: 19, title: 'a titel', text: 'hoi 2', user_id: 1},
            {id: 29, title: 'titel b', text: 'hoi 2', user_id: 1},
            {id: 39, title: '9 titel', text: 'hoi 2', user_id: 1},
        ]
    });

    expect(User.all().length).toStrictEqual(1);
    expect(Team.find(1)).toBeInstanceOf(Team);
    expect(Team.find(1).name).toStrictEqual('team relation 1');
    expect(UserAddress.find(22).city).toStrictEqual('Hoorn');
    expect(User.find(1).user_address).toBeInstanceOf(UserAddress);
    expect(User.find(1).team).toBeInstanceOf(Team);
    expect(User.find(1).avatar).toBeInstanceOf(Avatar);
    expect(User.find(1).comments.length).toStrictEqual(4);
    expect(Comment.all().length).toStrictEqual(4);

});


test('user can be saved', () => {
    let user = new User();
    user.name = 'Mark Man';
    user.team_id = 1;
    user.user_address_id = 22;

    expect(user.primaryKey).toContain('_');
    expect(Store.database().ids('User')).not.toContain(user.primaryKey);
    expect(user.name).toStrictEqual('Mark Man');

    user.save();
    expect(Store.database().ids('User')).toContain(user.primaryKey);
    user.id = 9;
    user.save();
    expect(Store.database().ids('User')).not.toContain('_6');
    expect(user.primaryKey).toEqual(9);
    expect(Store.database().ids('User')).toContain('9');

    const foundUser = Store.database().find('User', 9);
    expect(foundUser.name).toStrictEqual('Mark Man');
    user.name = 'Mark2';
    user.save();
    expect(foundUser.name).toStrictEqual('Mark2');
});
