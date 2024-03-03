import { gql } from "@apollo/client/core";
import client from "./client";

const FRAGMENT_JOB_DETAILS = gql`
  fragment JobDetails on Job {
    id
    title
    description
    company {
      id
      name
    }
    date
  }
`;

const MUTATION_CREATE_JOB = gql`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetails
    }
  }
  ${FRAGMENT_JOB_DETAILS}
`;

export const queryGetJobs = gql`
  query Jobs {
    jobs {
      ...JobDetails
    }
  }
  ${FRAGMENT_JOB_DETAILS}
`;

export const queryGetJobById = gql`
  query Job($id: ID!) {
    job(id: $id) {
      ...JobDetails
    }
  }
  ${FRAGMENT_JOB_DETAILS}
`;

export const queryGetCompanyById = gql`
  query Company($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        title
        date
      }
    }
  }
`;

export async function createJob(input) {
  const { data } = await client.mutate({
    mutation: MUTATION_CREATE_JOB,
    variables: { input },
    update: (cache, { data }) => {
      // Update the cache with the new job
      cache.writeQuery({
        query: queryGetJobById,
        variables: { id: data.job.id },
        data,
      });
    },
  });
  return data.job;
}
