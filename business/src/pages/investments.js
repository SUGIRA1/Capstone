import * as dayjs from "dayjs";
import { useEffect, useState } from "react";

import Layout from "../layout/Layout";
import InvestmentServices from "../services/investmentServices";
import { useRouter } from "next/router";

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
                  <h1 className="investments-title dashboard-title">
                    Investments
                  </h1>
                  <table className="investments-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Investor Email</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.investments?.map((inv) => (
                        <tr>
                          <td>{dayjs(inv.createdAt).format("MMM D, YYYY")}</td>
                          <td>{inv.client.email}</td>
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
