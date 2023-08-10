import axios from "axios";


export const getPublicFetch=(url:string)=>{
  return axios.create({
    baseURL: url,
  });
}

