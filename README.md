# jeloquent

**Class example**

```js
import Model from "../Store/Model.js";
import Field from "../Store/Model/Field.js";
import BelongsTo from "../Store/Model/Relation/BelongTo.js";
import Team from "./Team.js";
import Comment from "./Comment";
import HasMany from "../Store/Model/Relation/HasMany";

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

import {Database, Store} from './Store/Store.js';
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
