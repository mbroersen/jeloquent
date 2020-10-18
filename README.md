

# jeloquent
### Is an orm memory store for javascript. 

**Main goals are:** 
* to quickly select models and/or his relations using primaryKeys and foreignKeys
* automated indexing of relations
* use the relation names of laravel eloquent
* a simple setup of the relations
* return array collections of relations
* add easy accessors for relations on model
* keep the package lightweight and for modern browsers

## Speed test with more than 600 000 entities
5000 times a selection of an entity and 3 of his relations of all relation types, 
average speed in this test was `0.07ms` :smile:
![speed test](https://github.com/mbroersen/jeloquent/wiki/assets/images/speed_test.gif)

## Quick Setup Guide
[Quick Setup Guide](https://github.com/mbroersen/jeloquent/wiki/Quick-Setup)

## Documentation
[Quick Setup Guide](https://github.com/mbroersen/jeloquent/wiki/Home)

## Install
[![npm jeloquent](http://img.shields.io/npm/v/jeloquent.svg?style=flat)](https://www.npmjs.com/package/jeloquent) 

```bash
npm install jeloquent
```

## Usage

**Class example**

```js
import {Model, Field, HasMany, BelongsTo} from 'jeloquent';
import Team from "./Team.js";
import Comment from "./Comment";

export default class User extends Model {
    constructor() {
        const fields = [
            new Field('id', true),
            new Field('name'),
            new Field('team_id'),
            new BelongsTo(Team),
            new HasMany(Comment),
        ];
        super(fields);
    }
}

import {Model, Field, HasMany, HasManyThrough} from 'jeloquent';
import User from "./User";
import Comment from "./Comment";

export default class Team extends Model {

    constructor() {
        const fields = [
            new Field('id', true),
            new Field('name'),
            new HasMany(User),
            new HasManyThrough(Comment, User),
        ];

        super(fields);
    }
}

import {Model, Field, BelongsTo} from 'jeloquent';
import User from "./User";

export default class Comment extends Model {

    constructor() {
        const fields = [
            new Field('id', true),
            new Field('title'),
            new Field('text'),
            new Field('user_id'),
            new BelongsTo(User),
        ];

        super(fields);
    }
}

```

**Store example**

```js

import {Database, Store} from 'jeloquent';
import {User, Team, Comment} from './Models.js';

const models = [
    User,
    Team,
    Comment,
];

const store = new Store();
store.add(new Database('chess', models));
store.use('chess');

```

**Add data to table**

```js
User.insert([
    {id: 1, name: 'name', 'team_id': 1},
    {id: 2, name: 'name 2', 'team_id': 1}
]);
```

**Add one model or temporary model to table** 
```js
const newUser = new User();
newUser.name = 'New User';
newUser.team_id = 1;
newUser.save();
```

It generates a temporary key then can be used to find the model
```js
User.find('_1');
```

When you update the primary key, then the primary key index will be replaced.
```js
const newUser = User.find('_1');
newUser.id = 1234;
newUser.save();

//now use 
User.find(1234);
```



**Selecting data from tables**

```js
User.find(1);
User.find([1, 5, 9]);
User.all();
User.ids();
```

**Updating table data**

```js
User.update(model);
User.delete(1);
```

**Fetching relation**

```js
// return Team object or null
User.find(1).team;

//returns array of comments or empty array
User.find(1).comments;

// Has many trough
// same as Team.select(1).users.reduce((array, user) => {array.push(...user.comments)}, []);
Team.find(1).comments;
```

**Relations getters**

```js
//BelongsTo

//return true or false
User.find(1).hasTeam 

//HasMany

User.find(1).hasComments

// returns number of comments of user 1
User.find(1).commentsCount

```

**Filter on relation properties**

```js

User.all().filter(user => user.commentsCount > 5);
User.all().filter(user => !user.hasComment);

```

**Getting model and direct relations as json object** 
```js

const jsonDataOfUser = User.find(1).toJson();

//results in
{
    comments: [
        {id: 1, title: "Hello", text: 'Bla Bla', user_id: 1}, 
        {id: 2, title: "Hello 2", text: 'Bla Bla Bla', user_id: 1}
    ],
    id: 1,
    name: 'test 1',
    team_id: 1,
    team: {id: 1, name: 'name'}
};
```

















