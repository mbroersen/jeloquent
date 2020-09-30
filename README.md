# jeloquent

**Class example**

```js
import {Model, Field, HasMany, BelongsTo} from '../dist/jeloquent.js';
import Team from "./Team.js";
import Comment from "./Comment";

export default class User extends Model {
    constructor() {
        const fields = [
            new Field('id', true),
            new Field('name'),
            new Field('team_id'),
            new BelongsTo(Team),
            new HasMany(Comment) //should have index
        ];
        super(fields);
    }
}

```

**Store example**

```js

import {Database, Store} from './dist/jeloquent.js';
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



















