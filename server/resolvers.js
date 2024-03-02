import { getCompany } from "./db/companies.js";
import { getJobs } from "./db/jobs.js";

const resolvers = {
  Query: {
    jobs: () => getJobs(),
  },

  Job: {
    date: (job) => toISO8601Date(job.createdAt),
    company: (job) => getCompany(job.companyId),
  },
};

function toISO8601Date(dateString) {
  return dateString.slice(0, "yyyy-mm-dd".length);
}

export default resolvers;
