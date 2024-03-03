import { getCompany } from "./db/companies.js";
import {
  getJobs,
  getJob,
  getJobsByCompanyId,
  createJob,
  updateJob,
  deleteJob,
} from "./db/jobs.js";
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

  Mutation: {
    createJob: (_root, { input }, { user }) => {
      if (!user) {
        throw new UnauthorizedError("Missing authentication");
      }
      return createJob({ ...input, companyId: user.companyId });
    },
    updateJob: async (_root, { input }, { user }) => {
      if (!user) {
        throw new UnauthorizedError("Missing authentication");
      }
      const job = await updateJob({...input, companyId: user.companyId});
      if (!job) {
        throw new NotFoundError(`Job not found: ${input.id}`);
      }
      return job;
    },
    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        throw new UnauthorizedError("Missing authentication");
      }
      const job = await deleteJob(id, user.companyId);
      if (!job) {
        throw new NotFoundError(`Job not found: ${id}`);
      }
      return job;
    }
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

class UnauthorizedError extends GraphQLError {
  constructor(message) {
    super(message, { extensions: { code: "UNAUTHORIZED" } });
  }
}

export default resolvers;
