import * as dayjs from "dayjs";
import { useEffect, useState } from "react";

import Layout from "../layout/Layout";
import InvestmentServices from "../services/investmentServices";
import { useRouter } from "next/router";
import WithAuth from "../components/auth/WithAuth";

const Home = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    InvestmentServices.getBusinesses()
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
    <Layout>
      <main className="hero">
        <div className="container">
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
              <h1 className="hero-title">Businesses</h1>
              <p className="hero-description">
                You invest now in companies, help them grow and you will receive
                your return on investment.
              </p>

              <div className="card-row">
                {data?.map((business) => (
                  <div
                    className="card-column"
                    onClick={() => {
                      router.push(`/invest/${business._id}`);
                    }}
                  >
                    <img
                      src={
                        business.image
                          ? business.image
                          : "https://via.placeholder.com/400x200"
                      }
                      alt="Company Name"
                      className="card-column-image"
                    />
                    <div className="card-content">
                      <h2 className="card-title">{business.name}</h2>
                      <p className="card-description">{business.description}</p>
                      <div className="card-line"></div>
                      <div className="card-stats">
                        <div className="card-stats-row">
                          <p className="card-stats-money">
                            Rwf {business.totalInvestment}
                          </p>
                          <p className="card-stats-text">Raised</p>
                        </div>
                        <div className="card-stats-row">
                          <p className="card-stats-money">
                            Rwf {business.goalAmount}
                          </p>
                          <p className="card-stats-text">Goal</p>
                        </div>

                        <div className="card-stats-row">
                          <p className="card-stats-money">
                            Rwf {business.minAmount}
                          </p>
                          <p className="card-stats-text">Min-Amount</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Home;
