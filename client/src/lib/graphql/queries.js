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

export async function getJobs() {
  const query = gql`
    query Jobs {
      jobs {
        id
        title
        company {
          id
          name
        }
        date
      }
    }
  `;

  const { data } = await client.query({ query });
  return data.jobs;
}

export async function getJob(id) {
  const query = gql`
    query Job($id: ID!) {
      job(id: $id) {
        id
        title
        description
        company {
          id
          name
        }
        date
      }
    }
  `;

  const { data } = await client.query({ query, variables: { id } });
  return data.job;
}

export async function getCompany(id) {
  const query = gql`
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

  const { data } = await client.query({ query, variables: { id } });
  return data.company;
}

export async function createJob(input) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;

  const { data } = await client.mutate({ mutation, variables: { input } });
  return data.job;
}
