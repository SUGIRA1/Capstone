import * as dayjs from "dayjs";
import { useEffect, useState } from "react";

import Layout from "../layout/Layout";
import InvestmentServices from "../services/investmentServices";
import { useRouter } from "next/router";
import WithAuth from "../components/auth/WithAuth";

const Investments = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    InvestmentServices.getInvestments()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  }, []);

  return (
    <>
      <Layout>
        <main className="investments-section">
          <div className="container">
            <div className="investments-row">
              {loading ? (
                <h2>Loading ...</h2>
              ) : error == "Network Error" ? (
                <>
                  <div className="message-container text-center">
                    <h2>Server problem!</h2>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="investments-title">Your Investments</h1>
                  <div className="stats-row">
                    <div className="stats-card">
                      <h2 className="stats-number">{data?.totalInvestments}</h2>
                      <p className="stats-description">Total Investments</p>
                    </div>
                    <div className="stats-card">
                      <h2 className="stats-number">Rwf {data?.totalAmount}</h2>
                      <p className="stats-description">Total Invested Amount</p>
                    </div>
                    <div className="stats-card">
                      <h2 className="stats-number">{data?.totalBusiness}</h2>
                      <p className="stats-description">Total Business</p>
                    </div>
                  </div>
                  <h2 className="detailed-title">Recent investment</h2>
                  <table className="investments-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Company Name</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.investments?.map((inv) => (
                        <tr>
                          <td>{dayjs(inv.createdAt).format("MMM D, YYYY")}</td>
                          <td>{inv.business.name}</td>
                          <td>Rwf {inv.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};

export default Investments;
