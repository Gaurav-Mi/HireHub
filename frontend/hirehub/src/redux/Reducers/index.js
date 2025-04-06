import { combineReducers } from "redux";
import authReducer from "./authreducers";
import jobReducer from "./jobreducer";

export default combineReducers({
  auth: authReducer,
  jobs: jobReducer,
});
