import {Store,
    Database, BelongsTo, HasOne, Model, Field, HasMany, HasManyThrough, MorphOne, MorphTo,
    HasOneThrough
} from '../src/Jeloquent';

class AvatarInfo extends Model {
    constructor() {
        const fields = [
            new Field('id', true),
            new Field('name'),
        ];

        super(fields);
    }
}


/**
 * Has composed primary key {avatar_id: '', avatar_type: ''}
 * Can access parent object by calling myParent
 *
 */
class Avatar extends Model {
    constructor() {
        const fields = [
            new Field('img_url'),
            new Field('avatar_id', true),
            new Field('avatar_type', true),
            new BelongsTo(AvatarInfo),
            new MorphTo('my_parent'),
        ];

        super(fields);
    }
}




class User extends Model {
    constructor() {
        const fields = [
            new Field('id', true),
            new Field('name'),
            //new Field('team_id'),
            new BelongsTo(Team),
            new HasMany(Comment),
            new MorphOne(Avatar),
            new HasOne(UserAddress),
            //new MorphOneThrough(Avatar, Team) fix relation
        ];
        super(fields);
    }
}

/**
 *
 */
class UserAddress extends Model{

    constructor() {
        const fields = [
            new Field('id', true),
            new Field('city'),
            new Field('street'),
            new Field('house_number'),
            //new Field('user_id'),
            new BelongsTo(User),
        ];
        super(fields);
    }
}


class Team extends Model {

    constructor() {
        const fields = [
            new Field('id', true),
            new Field('name'),
            new HasMany(User),
            new HasManyThrough(Comment, User),
            new MorphOne(Avatar)
        ];

        super(fields);
    }
}

class TwoPersonTeam extends Model {

    constructor() {
        const fields = [
            new Field('id', true),
            new Field('name'),
            new BelongsTo(User, 'user_one_id', 'user_one'),
            new BelongsTo(User, 'user_two_id', 'user_two'),
        ];

        super(fields);
    }
}


class Comment extends Model {

    constructor() {
        const fields = [
            new Field('id', true),
            new Field('title'),
            new Field('text'),
            new BelongsTo(User),
            new HasOneThrough(UserAddress, User),
        ];

        super(fields);
    }
}

const testStore = new Store();
const database = new Database('default', [Team, TwoPersonTeam, User, Comment, AvatarInfo, Avatar, UserAddress]);
testStore.add(database);
testStore.use('default');


export {
    Team,
    User,
    Comment,
    Avatar,
    AvatarInfo,
    UserAddress,
    TwoPersonTeam,
    testStore
}