import { combineReducers } from "redux";

import { user } from './user'

const Reduders = combineReducers({
    userState: user
})