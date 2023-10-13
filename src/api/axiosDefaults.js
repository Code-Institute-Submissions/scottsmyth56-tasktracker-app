import axios from "axios"


axios.defaults.baseURL = "http://127.0.0.1:8000/"
axios.defaults.headers.post["Content-Type"] = "application/json"
axios.defaults.withCredentials = true


export const axiosRequest = axios.create()
export const axiosResponse = axios.create()

