const prod = {
    url: {
     API_URL: 'http://localhost:5000'
     }
   };
   const dev = {
    url: {
     API_URL: 'http://writersblcok1.herokuapp.com'
    }
   };
   export const apiConfig = process.env.NODE_ENV === 'development' ? dev : prod;