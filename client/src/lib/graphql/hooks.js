import { useMutation, useQuery } from "@apollo/client";
import { queryGetCompanyById, queryGetJobById, queryGetJobs } from "./queries";
import { mutationCreateJob } from "./mutations";

export function useJobs(limit, offset) {
  const { data, loading, error } = useQuery(queryGetJobs, {
    fetchPolicy: "network-only",
    variables: { limit, offset },
  });
  return {
    loading,
    data: data ? data.jobs : null,
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

export function useCreateJob() {
  const [mutate, { loading }] = useMutation(mutationCreateJob);

  const createJob = async ({ title, description }) => {
    const { data } = await mutate({
      variables: { input: { title, description } },
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
  };

  return [createJob, loading];
}
