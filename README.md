

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
average speed in this test was 0.19ms :smile:

After release 1.2.1 same test, has an average of `0.05ms`
![speed test](./docs/img/speed_test.gif)

## Install

[![npm jeloquent](http://img.shields.io/npm/v/jeloquent.svg?style=flat)](https://www.npmjs.com/package/jeloquent) 

```bash
npm install jeloquent
```


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

**Selecting data from tables**

```js
User.select(1)
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
User.select(1).team;

//returns array of comments or empty array
User.select(1).comments;

// Has many trough
// same as Team.select(1).users.reduce((array, user) => {array.push(...user.comments)}, []);
Team.select(1).comments;
```

**Relations getters**

```js
//BelongsTo

//return true or false
User.select(1).hasTeam 

//HasMany

User.select(1).hasComments

// returns number of comments of user 1
User.select(1).commentsCount

```

**Filter on relation properties**

```js

User.all().filter(user => user.commentsCount > 5);
User.all().filter(user => !user.hasComment);

```



















