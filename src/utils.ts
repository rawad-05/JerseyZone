export function parseHash(hashStr: string) {
  const hash = hashStr.replace(/^#/, "");
  const [path, queryStr] = hash.split("?");
  const query: Record<string, string> = {};
  if (queryStr) {
    queryStr.split("&").forEach((param) => {
      const [key, val] = param.split("=");
      if (key) {
        query[decodeURIComponent(key)] = decodeURIComponent(val || "");
      }
    });
  }
  return { path: path || "home", query };
}

export function formatPrice(amount: number): string {
  return `${amount.toFixed(2)} د.ل`;
}
