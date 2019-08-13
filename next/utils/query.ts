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
