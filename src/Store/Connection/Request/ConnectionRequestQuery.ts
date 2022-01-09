export default class ConnectionRequestQuery {

    private $fields: Array<string>;

    private $includes: Array<string>;

    private $pageNumber: number;

    private $pageSize: number;

    private $sort:Array<string>;

    fields(...fields:Array<string>) {
        this.$fields = fields;
    }

    includes(...includes:Array<string>) {
        this.$includes = includes;
    }

    page(number:number, size:number) {
        this.$pageNumber = number;
        this.$pageSize = size;
    }

    queryString():string {
        return `sort=${this.$sort.join(",")}&` +
            `includes=${this.$includes.join(",")}&` +
            `fields=${this.$fields.join(",")}&` +
            `page[number]=${this.$pageNumber}&page[size]=${this.$pageSize}`;
    }

    sort(...sort:Array<string>) {
        this.$sort = sort;
    }
}