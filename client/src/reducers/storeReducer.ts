import { combineReducers } from "redux";
import progressReducer from "./progressReducer";

const storeReducer = combineReducers({ linearProgress: progressReducer });

export default storeReducer;
