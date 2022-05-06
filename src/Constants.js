const prod = {
    url: {
     API_URL: process.env.PROD_API_URL
     }
   };
   const dev = {
    url: {
     API_URL: process.env.DEV_API_URL
    }
   };
   export const apiConfig = process.env.NODE_ENV === 'development' ? dev : prod;