import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getCompany } from "../lib/graphql/queries.js";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();

  const [state, setState] = useState({
    status: "loading",
    data: null,
  });

  useEffect(() => {
    getCompany(companyId).then(
      (data) => {
        setState({ status: "resolved", data });
      },
      () => {
        setState({ status: "rejected", data: null });
      }
    );
  }, [companyId]);

  const { data: company, status } = state;

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "rejected") {
    return <p>Oops! Data unavailable</p>;
  }

  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h3 className="title is-3">Jobs</h3>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
