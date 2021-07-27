import http from "../api/Client";
const url = "municipios";

const getAll = (id) => {
  return http.get(`${url}/estado/${id}`);
};

const get = (id) => {
    return http.get(`${url}/${id}`);
};

const create = (data) =>  {
    return http.post(`${url}`, data);
};

const update = (id, data) => {
  return http.put(`${url}/${id}`, data);
};

const remove = (id) => {
    return http.delete(`${url}/${id}`);
};

export { getAll, get, create, update, remove };
