import requests from "./httpServices";

const InvestmentServices = {
  getInvestors() {
    return requests.get("/business/investors");
  },

  getInvestments() {
    return requests.get("/investment/business");
  },
};

export default InvestmentServices;
