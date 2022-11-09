export const siteURL =
  process.env.NODE_ENV !== "production"
    ? "localhost"
    : "https://my-production-site.com";

export const apiURL = `${siteURL}/api`;
