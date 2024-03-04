import { gql } from "@apollo/client";

export const fragmentJobDetails = gql`
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
