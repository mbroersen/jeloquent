import {Collection} from "../src/Jeloquent";

test('Where statement of collection', () => {
    const nameFilter = new Collection(
        {id: 1, name: 'test'},
        {id: 2, name: 'test2'},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).where('name', 'test2');

    expect(nameFilter.length).toStrictEqual(2);
    expect(nameFilter).toBeInstanceOf(Collection);
    expect(nameFilter).toContainEqual({id: 2, name: 'test2'});
    expect(nameFilter).toContainEqual({id: 3, name: 'test2'});

    const idFilterGT = new Collection(
        {id: 1, name: 'test'},
        {id: 2, name: 'test2'},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).where('id', '>', 2);

    expect(idFilterGT.length).toStrictEqual(2);
    expect(idFilterGT).toBeInstanceOf(Collection);
    expect(idFilterGT).toContainEqual({id: 3, name: 'test2'});
    expect(idFilterGT).toContainEqual({id: 4, name: 'test3'});

    const idFilterGTE = new Collection(
        {id: 1, name: 'test'},
        {id: 2, name: 'test2'},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).where('id', '>=', 2);

    expect(idFilterGTE.length).toStrictEqual(3);
    expect(idFilterGTE).toBeInstanceOf(Collection);
    expect(idFilterGTE).toContainEqual({id: 2, name: 'test2'});
    expect(idFilterGTE).toContainEqual({id: 3, name: 'test2'});
    expect(idFilterGTE).toContainEqual({id: 4, name: 'test3'});


    const idFilterST = new Collection(
        {id: 1, name: 'test'},
        {id: 2, name: 'test2'},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).where('id', '<', 2);

    expect(idFilterST.length).toStrictEqual(1);
    expect(idFilterST).toBeInstanceOf(Collection);
    expect(idFilterST).toContainEqual({id: 1, name: 'test'});

    const idFilterSTE = new Collection(
        {id: 1, name: 'test'},
        {id: 2, name: 'test2'},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).where('id', '<=', 2);

    expect(idFilterSTE.length).toStrictEqual(2);
    expect(idFilterSTE).toBeInstanceOf(Collection);
    expect(idFilterSTE).toContainEqual({id: 1, name: 'test'});
    expect(idFilterSTE).toContainEqual({id: 2, name: 'test2'});

    const idFilterEq = new Collection(
        {id: 1, name: 'test'},
        {id: 2, name: 'test2'},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).where('id', '==', 2);

    expect(idFilterEq.length).toStrictEqual(1);
    expect(idFilterEq).toBeInstanceOf(Collection);
    expect(idFilterEq).toContainEqual({id: 2, name: 'test2'});
});

test('pluck function of collection', () => {
    const pluck = new Collection(
        {id: 1, name: 'test'},
        {id: 9, name: 'test2'},
        {id: 3, name: 'test2'},
        {id: 41, name: 'test3'}
    ).pluck('id');

    expect(pluck).toBeInstanceOf(Array);
    expect(pluck.length).toStrictEqual(4);
    expect(pluck).toContain(1);
    expect(pluck).toContain(3);
    expect(pluck).toContain(9);
    expect(pluck).toContain(41);


    const pluckWithCollections = new Collection(
        {id: 1, name: 'test', users:
                new Collection(
                    {id: 2221, name: 'team 1 user test'},
                    {id: 2222, name: 'team 1 user test2'},
                    {id: 2223, name: 'team 1 user test2'}
                )},
        {id: 9, name: 'test2', users:
                new Collection(
                    {id: 9991, name: 'team 9 user test'},
                    {id: 9991, name: 'team 9 user test2'},
                    {id: 9992, name: 'team 9 user test2'}
                )},
        {id: 3, name: 'test2', users:
                new Collection(
                    {id: 1, name: 'team 3 user test'},
                    {id: 9, name: 'team 3 user test2'},
                    {id: 3, name: 'team 3 user test2'}
                )},
        {id: 41, name: 'test3', users:
                new Collection(
                    {id: 411, name: 'team 41user test'},
                    {id: 419, name: 'team 41 user test2'},
                    {id: 413, name: 'team 41 user test2'}
                )
        }
    ).pluck('users.name');

    //fix pluck from relations
    expect(pluckWithCollections.length).toStrictEqual(4);
    expect(pluckWithCollections[0].length).toStrictEqual(3);
    expect(pluckWithCollections[0]).toContain('team 1 user test');
    expect(pluckWithCollections[1].length).toStrictEqual(3);
    expect(pluckWithCollections[1]).toContainEqual('team 9 user test2');
    expect(pluckWithCollections[2].length).toStrictEqual(3);
    expect(pluckWithCollections[2]).toContainEqual('team 3 user test2');
    expect(pluckWithCollections[3].length).toStrictEqual(3);
    expect(pluckWithCollections[3]).toContainEqual('team 41user test');


    const simpleRelationPluck = new Collection(
        {id: 1, name: 'test', team: {name: 'teamtest1'}},
        {id: 9, name: 'test2', team: {name: 'teamtest2'}},
        {id: 3, name: 'test2', team: {name: 'teamtest3'}},
        {id: 41, name: 'test3', team: {name: 'teamtest4'}}
    ).pluck('team.name');

    expect(simpleRelationPluck.length).toStrictEqual(4);
    expect(simpleRelationPluck).toBeInstanceOf(Array);
    expect(simpleRelationPluck).toContain('teamtest1');
    expect(simpleRelationPluck).toContain('teamtest2');
    expect(simpleRelationPluck).toContain('teamtest3');
    expect(simpleRelationPluck).toContain('teamtest4');
});

test('merge function of collection', () => {
    const mergedCollection = new Collection(
        {id: 1, name: 'test'},
        {id: 2, name: 'test2'},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).merge(new Collection({id: 100, name: 'test100'},
        {id: 102, name: 'test102'},
        {id: 103, name: 'test103'},
        {id: 104, name: 'test104'}));

    expect(mergedCollection).toBeInstanceOf(Collection);
    expect(mergedCollection.length).toStrictEqual(8);
    expect(mergedCollection).toContainEqual({id: 2, name: 'test2'});
    expect(mergedCollection).toContainEqual({id: 104, name: 'test104'});
});

test('first function of collection', () => {
    const first = new Collection(
        {id: 1, name: 'test'},
        {id: 2, name: 'test2'},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).first();

    expect(first).toBeInstanceOf(Object);
    expect(first).toStrictEqual({id: 1, name: 'test'});
});

test('last function of collection', () => {
    const last = new Collection(
        {id: 1, name: 'test'},
        {id: 2, name: 'test2'},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).last();

    expect(last).toBeInstanceOf(Object);
    expect(last).toStrictEqual({id: 4, name: 'test3'});
});


test('where(Not)Between statement of collection', () => {
    const between = new Collection(
        {id: 1, name: 'test'},
        {id: 2, name: 'test2'},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).whereBetween('id', [2, 3]);

    expect(between.length).toStrictEqual(2);
    expect(between).toBeInstanceOf(Collection);
    expect(between).toContainEqual({id: 2, name: 'test2'});
    expect(between).toContainEqual({id: 3, name: 'test2'});

    const notBetween = new Collection(
        {id: 1, name: 'test'},
        {id: 2, name: 'test2'},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).whereNotBetween('id', [2,3]);

    expect(notBetween.length).toStrictEqual(2);
    expect(notBetween).toBeInstanceOf(Collection);
    expect(notBetween).toContainEqual({id: 1, name: 'test'});
    expect(notBetween).toContainEqual({id: 4, name: 'test3'});
});

test('where(Not)In statement of collection', () => {
    const whereIn = new Collection(
        {id: 1, name: 'test'},
        {id: 2, name: 'test2'},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).whereIn('id', [1, 4]);

    expect(whereIn.length).toStrictEqual(2);
    expect(whereIn).toBeInstanceOf(Collection);
    expect(whereIn).toContainEqual({id: 1, name: 'test'});
    expect(whereIn).toContainEqual({id: 4, name: 'test3'});

    const whereNotIn = new Collection(
        {id: 1, name: 'test'},
        {id: 2, name: 'test2'},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).whereNotIn('id', [1, 4]);

    expect(whereNotIn.length).toStrictEqual(2);
    expect(whereNotIn).toBeInstanceOf(Collection);
    expect(whereNotIn).toContainEqual({id: 2, name: 'test2'});
    expect(whereNotIn).toContainEqual({id: 3, name: 'test2'});
});

test('where(Not)Null statement of collection', () => {
    const whereNotNull = new Collection(
        {id: 1, name: 'test'},
        {id: 2, name: null},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).whereNotNull('name');

    expect(whereNotNull.length).toStrictEqual(3);
    expect(whereNotNull).toBeInstanceOf(Collection);
    expect(whereNotNull).not.toContain({id: 2, name: null});

    const whereNull = new Collection(
        {id: 1, name: 'test'},
        {id: 2, name: null},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).whereNull('name');

    expect(whereNull.length).toStrictEqual(1);
    expect(whereNull).toBeInstanceOf(Collection);
    expect(whereNull).toContainEqual({id: 2, name: null});
});

test('where(Not)InstanceOf statement of collection', () => {
    const whereInstanceOf = new Collection(
        {id: 1, name: 'test'},
        new Collection(),
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).whereInstanceOf(Collection);

    expect(whereInstanceOf.length).toStrictEqual(1);
    expect(whereInstanceOf).toBeInstanceOf(Collection);
    expect(whereInstanceOf).toContainEqual(new Collection());

    const whereNotInstanceOf = new Collection(
        {id: 1, name: 'test'},
        new Collection(),
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).whereNotInstanceOf(Collection);

    expect(whereNotInstanceOf.length).toStrictEqual(3);
    expect(whereNotInstanceOf).toBeInstanceOf(Collection);
    expect(whereNotInstanceOf).not.toContainEqual(new Collection());
});


test('returning random value', () => {

    const randomCollection = new Collection(
        {id: 1, name: 'test'},
        {id: 2, name: null},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    );


    expect(randomCollection.random().id).toBeLessThan(5);
    expect(randomCollection.random().id).toBeLessThan(5);
    expect(randomCollection.random().id).toBeLessThan(5);
    expect(randomCollection.random().id).toBeLessThan(5);
    expect(randomCollection.random().id).toBeLessThan(5);
    expect(randomCollection.random().id).toBeLessThan(5);
    expect(randomCollection.random().id).toBeLessThan(5);
    expect(randomCollection.random().id).toBeLessThan(5);
    expect(randomCollection.random().id).toBeLessThan(5);
});

test('returning random value', () => {

    const uniqueCollection = new Collection(
        {id: 1, name: 'test'},
        {id: 1, name: 'test'},
        {id: 1, name: 'test'},
        {id: 1, name: 'test'},
        {id: 1, name: 'test'},
        {id: 2, name: null},
        {id: 3, name: 'test2'},
        {id: 4, name: 'test3'}
    ).unique('id');

    expect(uniqueCollection).toBeInstanceOf(Collection);
    expect(uniqueCollection.length).toStrictEqual(4);
});