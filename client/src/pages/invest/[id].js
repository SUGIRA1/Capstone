import * as dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import InvestmentServices from "../../services/investmentServices";
import Layout from "../../layout/Layout";

const Invest = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const id = router.query.id;

  useEffect(() => {
    if (!id) {
      router.push("/");
    } else {
      InvestmentServices.getOneBusiness(id)
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message);
        });
    }
  }, []);

  return (
    <Layout>
      <section className="investment-section">
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
            <div className="investment-row">
              {data?.map((business) => (
                <>
                  <div className="investment-column">
                    <h1 className="investment-title">
                      Invest in {business.name}
                    </h1>
                    <p className="investment-description">
                      {business.description}
                    </p>
                    <div className="investment-money-row">
                      <div className="investment-money-column">
                        <h2 className="investment-money">
                          Rwf {business.totalInvestment}
                        </h2>
                        <p className="investment-raised">Raised</p>
                      </div>
                      <div className="investment-money-column">
                        <h2 className="investment-money">
                          Rwf {business.goalAmount}
                        </h2>
                        <p className="investment-raised">Goal</p>
                      </div>
                      <div className="investment-money-column">
                        <h2 className="investment-money">
                          Rwf {business.minAmount}
                        </h2>
                        <p className="investment-raised">Min amount</p>
                      </div>
                    </div>
                    <button
                      className="btn investment-button"
                      onClick={() => {
                        router.push(`/payment?ref=${id}`);
                      }}
                    >
                      Invest Now
                    </button>
                  </div>
                  <div className="investment-column">
                    <div className="video-container">
                      <iframe
                        width="100%"
                        height="315"
                        src={business.pitchVideo}
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                      ></iframe>
                    </div>

                    <h3 className="video-title">Company Pitch</h3>
                  </div>
                </>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Invest;
