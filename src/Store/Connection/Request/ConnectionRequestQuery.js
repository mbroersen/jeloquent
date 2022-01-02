export default class ConnectionRequestQuery {

    page(number, size) {
        this.$pageNumber = number;
        this.$pageSize = size;
    }

    sort(...sort) {
        this.$sort = sort;
    }

    fields(...fields) {
        this.$fields = fields;
    }

    includes(...includes) {
        this.$includes = includes;
    }


    queryString() {
        return  `sort=${this.$sort.join(",")}&` +
                `includes=${this.$includes.join(",")}&` +
                `fields=${this.$fields.join(",")}&` +
                `page[number]=${this.$pageNumber}&page[size]=${this.$pageSize}`;
    }
}