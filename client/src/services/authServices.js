import requests from "./httpServices";

const AuthServices = {
  clientLogin(body) {
    return requests.post("/client/login", body);
  },
  clientRegister(body) {
    return requests.post("/client/register", body);
  },
  updateClient(id, body) {
    return requests.put(`/client/update/${id}`, body);
  },
  changePassword(body) {
    return requests.post("/client/change-password", body);
  },
};

export default AuthServices;
