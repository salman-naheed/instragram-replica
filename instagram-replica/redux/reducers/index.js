import { combineReducers } from "redux";

import { user } from "./user";
import { users } from "./usersData";

const Reducers = combineReducers({
  userState: user,
  usersDataState: users,
});

export default Reducers;
