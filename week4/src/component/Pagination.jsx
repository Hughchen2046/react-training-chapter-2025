export default function Pagination({ pageInfo, onPageChange }) {
  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${!pageInfo.has_pre && "disabled"}`}>
          <a
            className="page-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(pageInfo.current_page - 1);
            }}
          >
            &laquo;
          </a>
        </li>

        {Array.from({ length: pageInfo.total_pages }, (_, i) => i + 1).map(
          (page) => (
            <li
              key={page}
              className={`page-item ${page === pageInfo.current_page && "active"}`}
            >
              <a
                className="page-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
              >
                {page}
              </a>
            </li>
          ),
        )}

        <li className={`page-item ${!pageInfo.has_next && "disabled"}`}>
          <a
            className="page-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(pageInfo.current_page + 1);
            }}
          >
            &raquo;
          </a>
        </li>
      </ul>
    </nav>
  );
}
