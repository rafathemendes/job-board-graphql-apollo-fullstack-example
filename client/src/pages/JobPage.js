import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/formatters";
import { getJob } from "../lib/graphql/queries";

function JobPage() {
  const { jobId } = useParams();

  const [state, setState] = useState({
    status: "loading",
    data: null,
  });

  useEffect(() => {
    getJob(jobId).then(
      (data) => {
        setState({ status: "resolved", data });
      },
      () => {
        setState({ status: "rejected", data: null });
      }
    );
  }, [jobId]);

  const { data: job, status } = state;

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "rejected") {
    return <p>Oops! Data unavailable</p>;
  }

  return (
    <div>
      <h1 className="title is-2">{job.title}</h1>
      <h2 className="subtitle is-4">
        <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
      </h2>
      <div className="box">
        <div className="block has-text-grey">
          Posted: {formatDate(job.date, "long")}
        </div>
        <p className="block">{job.description}</p>
      </div>
    </div>
  );
}

export default JobPage;
