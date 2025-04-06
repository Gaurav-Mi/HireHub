export const GET_JOBS = "GET_JOBS";
export const GET_EMPLOYER_JOBS = "GET_EMPLOYER_JOBS";


export const getJobs = (data) => {
  return {
    type: GET_JOBS,
    payload: data,
  };
};
export const getEmployerJobs = (jobs) => ({
  type: GET_EMPLOYER_JOBS,
  payload: jobs,
});
