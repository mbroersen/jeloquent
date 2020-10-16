import {Field, Model} from "../dist/jeloquent";

class User extends Model {
    constructor() {
        const fields = [
            new Field('id', true)
        ];
        super(fields);
    }
}


export {
    User
}