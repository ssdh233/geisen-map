type QueryObject = {
  [prop: string]: string | null;
};

export function toQuery(queryObj: QueryObject): string {
  const result = Object.keys(queryObj)
    .filter(key => queryObj[key])
    .map(key => {
      return `${key}=${queryObj[key]}`;
    })
    .join("&");

  return result;
}

export function parseQuery(queryStr: string): QueryObject {
  if (!queryStr) return {};

  if (queryStr.includes("?")) {
    queryStr = queryStr.substring(queryStr.indexOf("?") + 1);
  }

  let query = {};

  queryStr.split("&").forEach(str => {
    const [key, value] = str.split("=");
    query[key] = value;
  });

  return query;
}
