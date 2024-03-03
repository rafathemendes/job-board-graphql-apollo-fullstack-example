import {
  ApolloClient,
  InMemoryCache,
  concat,
  createHttpLink,
} from "@apollo/client";
import { gql } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { getAccessToken } from "../auth";

const httpLink = createHttpLink({
  uri: "http://localhost:9000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const accessToken = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

const client = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

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

const QUERY_GET_JOBS = gql`
  query Jobs {
    jobs {
      ...JobDetails
    }
  }
  ${FRAGMENT_JOB_DETAILS}
`;

const QUERY_GET_JOB_BY_ID = gql`
  query Job($id: ID!) {
    job(id: $id) {
      ...JobDetails
    }
  }
  ${FRAGMENT_JOB_DETAILS}
`;

const QUERY_GET_COMPANY = gql`
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

const MUTATION_CREATE_JOB = gql`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetails
    }
  }
  ${FRAGMENT_JOB_DETAILS}
`;

export async function getJobs() {
  const { data } = await client.query({
    query: QUERY_GET_JOBS,
    fetchPolicy: "network-only",
  });
  return data.jobs;
}

export async function getJob(id) {
  const { data } = await client.query({
    query: QUERY_GET_JOB_BY_ID,
    variables: { id },
  });
  return data.job;
}

export async function getCompany(id) {
  const { data } = await client.query({
    query: QUERY_GET_COMPANY,
    variables: { id },
    fetchPolicy: "network-only",
  });
  return data.company;
}

export async function createJob(input) {
  const { data } = await client.mutate({
    mutation: MUTATION_CREATE_JOB,
    variables: { input },
    update: (cache, { data }) => {
      // Update the cache with the new job
      cache.writeQuery({
        query: QUERY_GET_JOB_BY_ID,
        variables: { id: data.job.id },
        data,
      });
    },
  });
  return data.job;
}
