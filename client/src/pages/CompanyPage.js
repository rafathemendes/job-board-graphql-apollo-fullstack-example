import { useParams } from "react-router";
import JobList from "../components/JobList";
import { useCompany } from "../lib/graphql/hooks.js";

function CompanyPage() {
  const { companyId } = useParams();
  const { data: company, loading, error } = useCompany(companyId);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || !company) {
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
