type QueryObject = {
  [prop: string]: string;
};

export function toQuery(queryObj: QueryObject): string {
  const result = Object.keys(queryObj)
    .map(key => {
      return `${key}=${queryObj[key]}`;
    })
    .join("&");

  return result;
}
