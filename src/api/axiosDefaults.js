import axios from "axios"


axios.defaults.baseURL = "http://127.0.0.1:8000/"
axios.defaults.headers.post["Content-Type"] = "application/json"
axios.defaults.withCredentials = true
const authToken = localStorage.getItem('authToken');

if (authToken) {
  axios.defaults.headers.common['Authorization'] = `Token ${authToken}`;
  // console.log("using")
}

//REMOVE Line 
 console.log(axios.defaults.headers.common['Authorization']) 



export const axiosRequest = axios.create()
export const axiosResponse = axios.create()

