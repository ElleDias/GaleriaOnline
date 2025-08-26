//acesso que tem como base o local da nossa api

import axios from "axios";
const apiPorta = "7019"


//apiLocal ela recebe o endereco da api
const apilocal = `https://localhost:${apiPorta}/api/`;

const api = axios.create({
  baseURL: apilocal  
});

export default api;