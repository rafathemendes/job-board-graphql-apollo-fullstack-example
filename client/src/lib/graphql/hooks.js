import { useQuery } from "@apollo/client";
import { queryGetCompanyById, queryGetJobById, queryGetJobs } from "./queries";

export function useJobs() {
  const { data, loading, error } = useQuery(queryGetJobs, {
    fetchPolicy: "network-only",
  });
  return {
    loading,
    data: data ? data.jobs : [],
    error: Boolean(error),
  };
}

export function useJob(id) {
  const { data, loading, error } = useQuery(queryGetJobById, {
    variables: { id },
  });
  return {
    loading,
    data: data ? data.job : null,
    error: Boolean(error),
  };
}

export function useCompany(id) {
  const { data, loading, error } = useQuery(queryGetCompanyById, {
    variables: { id },
    fetchPolicy: "network-only",
  });
  return {
    loading,
    data: data ? data.company : null,
    error: Boolean(error),
  };
}
