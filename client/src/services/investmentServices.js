import requests from "./httpServices";

const InvestmentServices = {
  getBusinesses() {
    return requests.get("/client/businesses");
  },

  getOneBusiness(id) {
    return requests.get(`/business/one/${id}`);
  },

  getInvestments() {
    return requests.get("/investment/client");
  },

  addInvestment(body) {
    return requests.post("/investment/add", body);
  },

  processPayment(body) {
    return requests.post("/investment/process-payment", body);
  },
};

export default InvestmentServices;
