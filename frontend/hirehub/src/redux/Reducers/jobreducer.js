import { GET_JOBS, GET_EMPLOYER_JOBS } from "../Actions/jobActions";

const initialState = {
  jobs: [],
  employerJobs: [],
  appliedJobs: [],
};
const jobReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_JOBS:
      return {
        ...state,
        jobs: action.payload,
      };
    case GET_EMPLOYER_JOBS:
      return {
        ...state,
        employerJobs: action.payload,
      };
    default:
      return state;
  }
};

export default jobReducer;
