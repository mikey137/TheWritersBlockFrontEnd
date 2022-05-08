export const apiConfig = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_API_URL : process.env.REACT_APP_PROD_API_URL;

console.log(apiConfig)