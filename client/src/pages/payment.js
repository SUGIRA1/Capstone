import * as dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";

import Layout from "../layout/Layout";
import InvestmentServices from "../services/investmentServices";
import { useRouter } from "next/router";
import WithAuth from "../components/auth/WithAuth";
import { useForm } from "react-hook-form";
import Error from "../components/form/Error";
import { notifyError, notifySuccess } from "../utils/toast";
import { UserContext } from "../context/UserContext";

const Payment = ({ setUserInfo }) => {
  const {
    state: { userInfo },
  } = useContext(UserContext);

  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const router = useRouter();

  const { ref } = router.query;

  useEffect(() => {
    if (!ref || !userInfo) {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ phone, total }) => {
    if (!userInfo) {
      notifyError("Please Login first");
      return;
    }

    setPayLoading(true);
    try {
      const payRes = await InvestmentServices.processPayment({
        total: total,
        phone: phone,
      });

      if (payRes.status == "successful") {
        await InvestmentServices.addInvestment({
          client: userInfo?._id,
          business: ref,
          phone: phone,
          amount: total,
        }).then((res) => {
          notifySuccess("Invested successfully!");
          setPayLoading(false);
          router.push(`/payment-success?ref=${ref}`);
        });
      } else {
        notifyError(
          payRes.message
            ? payRes.message
            : "Payment processing failed. Try again later!"
        );
        setPayLoading(false);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        notifyError(error.response.data.message);
      } else {
        notifyError("An error occurred. Please try again later.");
      }

      setPayLoading(false);
    }
  };

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
              <h1 className="hero-title">Payment</h1>

              {data?.map((business) => (
                <>
                  <p className="hero-description">
                    You are investing in the Company:{" "}
                    <strong>{business.name} </strong>
                  </p>

                  <form
                    className="payment-form"
                    onSubmit={handleSubmit(submitHandler)}
                  >
                    <label htmlFor="phone">Phone</label>
                    <input
                      {...register(`phone`, {
                        required: `Phone is required!`,
                      })}
                      type="number"
                      id="phone"
                      name="phone"
                      placeholder="ex: 0788xxxxxx"
                      required
                    />
                    <Error errorName={errors.phone} />
                    <label htmlFor="amount">Amount(RWF)</label>
                    <input
                      {...register(`total`, {
                        required: `Amount is required!`,
                      })}
                      type="number"
                      id="amount"
                      name="total"
                      placeholder="Min: 2000"
                      required
                    />
                    <Error errorName={errors.total} />

                    {payLoading ? (
                      "Loading ..."
                    ) : (
                      <button type="submit" className="Submit">
                        Submit
                      </button>
                    )}
                  </form>
                </>
              ))}
            </>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default WithAuth(Payment);
