import { useEffect, useState } from "react";

import Layout from "../layout/Layout";
import InvestmentServices from "../services/investmentServices";
import { useRouter } from "next/router";

const Investors = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    InvestmentServices.getInvestors()
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
                    Investors
                  </h1>
                  <table className="investments-table">
                    <thead>
                      <tr>
                        <th>Investor Name</th>
                        <th>Investor Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.map((inv) => (
                        <tr>
                          <td>{inv.name}</td>
                          <td>{inv.email}</td>
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

export default Investors;
