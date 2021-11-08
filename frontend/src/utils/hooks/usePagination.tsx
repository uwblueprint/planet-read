import { DocumentNode, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import Paginator from "../../components/utils/Paginator";

interface PaginatedResult<T> {
  totalCount: number;
  edges: PaginatedEdge<T>[];
  pageInfo: PageInfo;
}

interface PaginatedEdge<T> {
  cursor: string;
  node: T;
  pageInfo: PageInfo;
}

interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

/*
 * A hook that adapts cursor-style pagination to support a table-based use-case.
 * @param query - The paginated GraphQL query
 * @param fieldName - The name of item being accessed, e.g. storyTranslations
 * @param itemPerPage - The number of items per page
 *
 * @returns pageResult - The items in the current page
 * @returns paginator - The UI pagination controller component
 */
function usePagination<ResultType>(
  query: DocumentNode,
  fieldName: string,
  itemsPerPage: number,
) {
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(-1);
  const [endIndex, setEndIndex] = useState<number>(-1);
  const [endCursor, setEndCursor] = useState<string>("");
  const [hasMoreToFetch, setHasMoreToFetch] = useState<boolean>(false);

  const numPages = totalItems ? totalItems / itemsPerPage : 1;

  // contains all the items fetched thus far
  const [results, setResults] = useState<ResultType[]>([]);

  const { fetchMore, loading } = useQuery(query, {
    fetchPolicy: "cache-and-network",
    variables: {
      first: itemsPerPage,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const result: PaginatedResult<ResultType> = data[fieldName];
      const items = result.edges.map((e) => e.node);
      setResults(items);
      setTotalItems(result.totalCount);
      setEndCursor(result.pageInfo.endCursor);
      setHasMoreToFetch(result.pageInfo.hasNextPage);
    },
  });

  // reset the page every time the query changes
  useEffect(() => {
    setCurrentPage(0);
  }, [query]);

  // update start and end indices when the page or result changes
  useEffect(() => {
    if (results.length > 0 && !loading) {
      setStartIndex(itemsPerPage * currentPage);
      setEndIndex(
        Math.min(itemsPerPage * (currentPage + 1), results.length) - 1,
      );
    } else {
      setStartIndex(-1);
      setEndIndex(-1);
    }
  }, [currentPage, results, loading]);

  const paginator = (
    <Paginator
      first={startIndex + 1}
      last={endIndex + 1}
      total={totalItems}
      hasPreviousPage={currentPage > 0}
      hasNextPage={currentPage < numPages - 1}
      onPreviousPage={() => {
        setCurrentPage((page) => page - 1);
      }}
      onNextPage={async () => {
        const numPagesFetched = results.length / itemsPerPage;
        const needsFetching =
          numPagesFetched === 0 || currentPage === numPagesFetched - 1;
        if (hasMoreToFetch && needsFetching) {
          await fetchMore({
            variables: {
              cursor: endCursor,
            },
          });
        }
        setCurrentPage((page) => page + 1);
      }}
    />
  );

  const pageResults = results.slice(startIndex, endIndex + 1);

  return { pageResults, paginator };
}

export default usePagination;
