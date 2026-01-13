import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";
import "./Pagination.css";
import { useEffect } from "react";

export default function Pagination({ func, pageCountApi, sortByParam, directionParam }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    const newParams = new URLSearchParams(searchParams);  
    newParams.set("page", newPage);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  
  useEffect(() => {
    func(currentPage);
  }, [currentPage,sortByParam,directionParam]);

  return (
    <div className="paginationWrapper">
      {pageCountApi > 0 && (
        <ReactPaginate
          className={"productsPagination"}
          breakLabel="..."
          nextLabel=">"
          previousLabel="<"
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          pageCount={pageCountApi}
          forcePage={currentPage - 1}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
        />
      )}
    </div>
  );
}
