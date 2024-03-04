import { useState } from "react";
import JobList from "../components/JobList";
import PaginationBar from "../components/PaginationBar";
import { useJobs } from "../lib/graphql/hooks";

const ITEMS_PER_PAGE = 5;

function HomePage() {
  const [page, setPage] = useState(1);

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const { data, loading, error } = useJobs(ITEMS_PER_PAGE, offset);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || !data) {
    return <p>Oops! Data unavailable</p>;
  }

  const { totalCount, items } = data;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <PaginationBar
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      <JobList jobs={items} />
    </div>
  );
}

export default HomePage;
