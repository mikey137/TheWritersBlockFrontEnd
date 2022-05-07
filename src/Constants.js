const prod = {
    url: {
     API_URL: 'https://writersblock1.herokuapp.com'
     }
   };
   const dev = {
    url: {
     API_URL: 'http://localhost:5000'
    }
   };
   export const apiConfig = process.env.NODE_ENV === 'development' ? dev : prod;