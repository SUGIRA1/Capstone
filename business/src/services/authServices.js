import requests from "./httpServices";

const AuthServices = {
  businessLogin(body) {
    return requests.post("/business/login", body);
  },
  businessRegister(body) {
    return requests.post("/business/register", body);
  },

  updateBusiness(id, body) {
    return requests.put(`/business/update/${id}`, body);
  },
};

export default AuthServices;
