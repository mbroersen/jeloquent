
export default class ConnectionRequestQuery {

    constructor() {

    }

    page(number, size) {

    }

    sort(...fields) {

    }

    fields(...fields) {
        this.$fields = fields;
    }

    includes(...includes) {

    }


    queryString() {

        `fields=${this.$fields.join(",")}`
        `page[number]=${this.$pageNumber}&page[size]=${this.pageSize}`;
    }
}