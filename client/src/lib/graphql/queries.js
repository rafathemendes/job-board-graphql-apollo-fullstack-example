import { gql } from "@apollo/client/core";
import { fragmentJobDetails } from "./fragments";

export const queryGetJobs = gql`
  query Jobs {
    jobs {
      ...JobDetails
    }
  }
  ${fragmentJobDetails}
`;

export const queryGetJobById = gql`
  query Job($id: ID!) {
    job(id: $id) {
      ...JobDetails
    }
  }
  ${fragmentJobDetails}
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
