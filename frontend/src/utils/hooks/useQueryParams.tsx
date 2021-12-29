import React from "react";
import { useLocation } from "react-router-dom";

// A custom hook to parse URL query strings
const useQueryParams = () => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
};

export default useQueryParams;
