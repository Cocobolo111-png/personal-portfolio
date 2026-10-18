// One origin-relative base for both a custom domain and GitHub project Pages.
export const siteUrl = (path = '') => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
