import { getCompany } from "./db/companies.js";
import { getJobs, getJob, getJobsByCompanyId } from "./db/jobs.js";

const resolvers = {
  Query: {
    jobs: () => getJobs(),
    job: (_root, { id }) => getJob(id),
    company: (_root, { id }) => getCompany(id),
  },

  Company: {
    jobs: (company) => getJobsByCompanyId(company.id),
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
