import http from "../api/Client";
const url = "estados";

const getAll = (paisid) => {
  return http.get(`${url}/pais/${paisid}`);
};

const getDD = (paisid) => {
  return http.get(`${url}/pais/${paisid}/active`);
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

export { getAll, get, create, update, remove, getDD };
