import {Collection} from "../dist/jeloquent";
import {User, Team, Avatar, UserAddress, Comment} from "./Models";

const userData = [
    {id: 1, name: 'test 1', team_id: 123},
    {id: 2, name: 'user 2', team_id: 123},
    {id: 3, name: 'user 3', team_id: 1},
    {id: 4, name: 'teamless user', team_id: null},
];

const teamData = [
    {id: 1, name: 'team 1'},
    {id: 123, name: 'team 123'},
    {id: 234, name: 'team no users'},
];

const userAddressData = [
    {id: 1, user_id: 1, city: 'Alkmaar', street: 'Waagplein', house_number: 21}
];

const avatarData = [
    {avatar_id: 1, avatar_type: 'User', 'img_url': 'http://test.com/test.png'},
    {avatar_id: 1, avatar_type: 'Team', 'img_url': 'http://test.com/test2.png'},
    {avatar_id: 123, avatar_type: 'Team', 'img_url': 'http://test.com/test3.png'},
];

const commentData = [
    {id: 1, title: 'title', text: 'My Text 1_1', user_id: 1},
    {id: 2, title: 'title', text: 'My Text 1_2', user_id: 1},
    {id: 3, title: 'title', text: 'My Text 1_3', user_id: 1},
    {id: 4, title: 'title', text: 'My Text 2_1', user_id: 2},
    {id: 5, title: 'title', text: 'My Text 2_2', user_id: 2},
    {id: 6, title: 'title', text: 'My Text 2_3', user_id: 2},
    {id: 7, title: 'title', text: 'My Text 3_1', user_id: 3},
    {id: 8, title: 'title', text: 'My Text 3_2', user_id: 3},
];

Avatar.insert(avatarData);
User.insert(userData);
UserAddress.insert(userAddressData);
Team.insert(teamData);
Comment.insert(commentData);

test('BelongsTo relations is added to user', () => {
    const lUser = User.find(1);

    expect(lUser.hasTeam).toStrictEqual(true);
    expect(lUser.team).toBeInstanceOf(Team);
    expect(lUser.team_id).toStrictEqual(123);
    expect(lUser.team.id).toStrictEqual(123);

    const lUser2 = User.find(4);
    expect(lUser2.hasTeam).toStrictEqual(false);
    expect(lUser2.team).toStrictEqual(null);

});


test('HasMany Relation is added to user model', () => {
    const lUser = User.find(1);
    expect(lUser.team.users).toBeInstanceOf(Collection);
    expect(lUser.team.users.length).toStrictEqual(2);
    expect(lUser.team.usersCount).toStrictEqual(2);
    expect(lUser.team.hasUsers).toStrictEqual(true);
    expect(lUser.team.users.first()).toBeInstanceOf(User);
    expect(lUser.team.users.first().id).toStrictEqual(1);

    const lTeam = Team.find(234);
    expect(lTeam.hasUsers).toStrictEqual(false);
    expect(lTeam.usersCount).toStrictEqual(0);
    expect(lTeam.users).toBeInstanceOf(Collection);

});

test('MorphOne Relation is added to user and team model', () => {
    const lUser = User.find(1);
    const lTeam = Team.find(1);

    expect(lTeam.avatar.img_url).toStrictEqual('http://test.com/test2.png');
    expect(lUser.avatar.img_url).toStrictEqual('http://test.com/test.png');
});


test('HasOne Relation is added to user model', () => {
    const lUser = User.find(1);

    expect(lUser.hasUserAddress).toStrictEqual(true);
    expect(lUser.user_address.city).toStrictEqual('Alkmaar');

    const lUser2 = User.find(2);
    expect(lUser2.hasUserAddress).toStrictEqual(false);
    //expect(lUser2.user_address).toStrictEqual(null);

});


test('HasManyThrough Relation is added to team model', () => {
    const lTeam = Team.find(123);
    expect(lTeam.comments.length).toStrictEqual(6);
    expect(lTeam.comments.first().user_id).toStrictEqual(1);
    expect(lTeam.comments.last().user_id).toStrictEqual(2);
});


test('HasOneThrough Relation is added to team model', () => {
    const lComment = Comment.find(1);

    expect(lComment.user_address).toBeInstanceOf(UserAddress);
    expect(lComment.user_address.city).toStrictEqual('Alkmaar');

});