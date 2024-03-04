import { gql } from "@apollo/client";
import { fragmentJobDetails } from "./fragments";

export const mutationCreateJob = gql`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetails
    }
  }
  ${fragmentJobDetails}
`;
