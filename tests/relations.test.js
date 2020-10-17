import {Collection} from "../dist/jeloquent";
import {User, Team} from "./Models";

const userData = {id: 1, name: "test 1", team_id: 123};
const teamData = {id: 123, name: "team 123"};




User.insert(userData)
Team.insert(teamData)



test('BelongsTo and HasMany Relations are added to model', () => {
    const lUser = User.find(1);

    expect(lUser.team_id).toStrictEqual(123);
    expect(lUser.team).toBeInstanceOf(Team);
    expect(lUser.team.id).toStrictEqual(123);
    expect(lUser.team.users).toBeInstanceOf(Collection);
    expect(lUser.team.users.length).toStrictEqual(1);
    expect(lUser.team.users.first()).toBeInstanceOf(User);
    expect(lUser.team.users.first().id).toStrictEqual(1);


});