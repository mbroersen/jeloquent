import {Store, Database, BelongsTo, HasOne, Model, Field, HasMany, HasManyThrough, MorphOne, MorphTo} from '../dist/jeloquent';


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




class Comment extends Model {

    constructor() {
        const fields = [
            new Field('id', true),
            new Field('title'),
            new Field('text'),
            //new Field('user_id'),
            new BelongsTo(User),
        ];

        super(fields);
    }
}

const testStore = new Store();
const database = new Database('default', [Team, User, Comment, Avatar, UserAddress]);
testStore.add(database);
testStore.use('default');


export {
    Team,
    User,
    Comment,
    Avatar,
    UserAddress,
    testStore
}