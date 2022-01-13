import {Collection} from "../src/Jeloquent";
import {User, UserAddress, testStore, Avatar, Team, Comment, TwoPersonTeam} from "./Models";


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
    expect(lUser._tmpId).toStrictEqual('_8');
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
    expect(UserAddress.className).toStrictEqual("UserAddress");
    expect(UserAddress.kebabCaseClassName).toStrictEqual("user-address");
    expect(UserAddress.snakeCaseClassName).toStrictEqual("user_address");
});

test('Model fetch all primaryKeys', () => {
    const indexes = User.ids();
    expect(indexes).toStrictEqual([12]);
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
    const user = new User();
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
    expect(Store.database().ids('User')).not.toContain('_7');
    expect(user.primaryKey).toEqual(9);
    expect(Store.database().ids('User')).toContain(9);

    const foundUser = Store.database().find('User', 9);
    expect(foundUser.name).toStrictEqual('Mark Man');
    user.name = 'Mark2';
    user.save();
    expect(foundUser.name).toStrictEqual('Mark2');
});

test('two belongsTo relation of same type can be saved', () => {
    testStore.database().truncate('User');

    TwoPersonTeam.insert({
        id: 1,
        name: "2 belongsTo Team",
        user_one: {id: 1, name: 'name', team_id: 1},
        user_two: {id: 2, name: 'name', team_id: 1},
        user_one_id: 1,
        user_two_id: 2,
    });

    const team = TwoPersonTeam.find(1);

    expect(team.user_one).toBeInstanceOf(User);
    expect(team.user_one.id).toStrictEqual(1);

    expect(team.user_two).toBeInstanceOf(User);
    expect(team.user_two.id).toStrictEqual(2);

    expect(JSON.stringify(Team.all().first())).toStrictEqual("{\"id\":1,\"name\":\"team relation 1\",\"users\":[{\"id\":1,\"name\":\"name\",\"team_id\":1},null,null,{\"id\":2,\"name\":\"name\",\"team_id\":1}],\"comments\":[{\"id\":9,\"title\":\"titel\",\"text\":\"hoi\",\"user_id\":1},{\"id\":19,\"title\":\"a titel\",\"text\":\"hoi 2\",\"user_id\":1},{\"id\":29,\"title\":\"titel b\",\"text\":\"hoi 2\",\"user_id\":1},{\"id\":39,\"title\":\"9 titel\",\"text\":\"hoi 2\",\"user_id\":1}],\"avatar\":null}");
    expect(Team.all().jsonStringify()).toStrictEqual("[{\"id\":1,\"name\":\"team relation 1\",\"users\":[{\"id\":1,\"name\":\"name\",\"team_id\":1},null,null,{\"id\":2,\"name\":\"name\",\"team_id\":1}],\"comments\":[{\"id\":9,\"title\":\"titel\",\"text\":\"hoi\",\"user_id\":1},{\"id\":19,\"title\":\"a titel\",\"text\":\"hoi 2\",\"user_id\":1},{\"id\":29,\"title\":\"titel b\",\"text\":\"hoi 2\",\"user_id\":1},{\"id\":39,\"title\":\"9 titel\",\"text\":\"hoi 2\",\"user_id\":1}],\"avatar\":null}]");
})


test('changed model has dirty fields', () => {

    const user = new User();
    expect(user.dirtyFields.length).toStrictEqual(0);
    user.name = 'test';
    expect(user.dirtyFields.length).toStrictEqual(1);
    user.save();
    expect(user.dirtyFields.length).toStrictEqual(0);
    user.name = null;
    expect(user.dirtyFields.length).toStrictEqual(1);
    user.save();
    expect(user.dirtyFields.length).toStrictEqual(0);
    user.name = 'test';
    expect(user.dirtyFields.length).toStrictEqual(1);
    user.save();
    expect(user.dirtyFields.length).toStrictEqual(0);

});


test('model has original value', () => {
    const user = new User();
    user.name = 'Mark Man';
    user.team_id = 1;
    user.user_address_id = 22;
    user.name = 'Mark Man2';

    expect(user.originalFields[1].originalValue).toStrictEqual('Mark Man');
    expect(user.originalFields[1].previousValue).toStrictEqual('Mark Man');

    user.name = 'Mark Man3';
    expect(user.originalFields[1].originalValue).toStrictEqual('Mark Man');
    expect(user.originalFields[1].previousValue).toStrictEqual('Mark Man2');

    user.save();
    expect(user.originalFields[1].originalValue).toStrictEqual('Mark Man3');
    expect(user.originalFields[1].previousValue).toStrictEqual('Mark Man3');


    const foundUser = User.find(user.primaryKey);
    expect(foundUser.originalFields[1].originalValue).toStrictEqual('Mark Man3');
    foundUser.name = 'Mark Man4';
    foundUser.name = 'Mark Man5';
    expect(foundUser.originalFields[1].originalValue).toStrictEqual('Mark Man3');
    expect(foundUser.originalFields[1].previousValue).toStrictEqual('Mark Man4');

    const originalKeys = Object.keys(foundUser.originalValues);
    expect(originalKeys).toContain('id');
    expect(originalKeys).toContain('name');
    expect(originalKeys).toContain('team_id');

    const originalValues = Object.values(foundUser.originalValues);
    expect(originalValues).toContain(null);
    expect(originalValues).toContain('Mark Man3');
    expect(originalValues).toContain(1);

});