import { getCompany } from "./db/companies.js";
import { getJobs, getJob, getJobsByCompanyId } from "./db/jobs.js";
import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    jobs: () => getJobs(),
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw new NotFoundError(`Job not found: ${id}`);
      }
      return job;
    },
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw new NotFoundError(`Company not found: ${id}`);
      }
      return company;
    },
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

class NotFoundError extends GraphQLError {
  constructor(message) {
    super(message, { extensions: { code: "NOT_FOUND" } });
  }
}

export default resolvers;
