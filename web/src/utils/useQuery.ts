import { useLocation } from "react-router-dom";
import { parseQuery } from "./query";

function useQuery() {
  const location = useLocation();
  const queryStr = location.search.substring(1);
  return parseQuery(queryStr);
}

export default useQuery;