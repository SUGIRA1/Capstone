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

  const { ref } = router.query;

  useEffect(() => {
    if (!ref) {
      router.push("/");
    } else {
      InvestmentServices.getOneBusiness(ref)
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
    <>
      <Layout>
        <main className="hero">
          <div className="container success-container">
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
                <div className="success-conf">
                  <img src="/images/check-circle.svg" alt="" />
                  <h3>Thank you for Investing</h3>
                  <p>
                    {" "}
                    {data?.map((business) => (
                      <strong>{business.name}</strong>
                    ))}{" "}
                    appreciate your contribution to its growth
                  </p>

                  <button
                    className="submit"
                    onClick={() => {
                      router.push("/investments");
                    }}
                  >
                    View investments
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </Layout>
    </>
  );
};

export default Investments;
