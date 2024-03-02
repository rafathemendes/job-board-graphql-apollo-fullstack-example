import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getCompany } from "../lib/graphql/queries.js";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();

  const [company, setCompany] = useState(null);

  useEffect(() => {
    getCompany(companyId).then(setCompany);
  }, [companyId]);

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h3 className="title is-3">Jobs</h3>
      <ul>
        <JobList jobs={company.jobs} />
      </ul>
    </div>
  );
}

export default CompanyPage;
