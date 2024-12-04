import React, { useState } from "react";
import { Link } from "react-router-dom";

import bg1 from "../../assets/images/hero/bg.jpg";

import Navbar from "../../components/navbar";
import Faq from "../../components/faq";
import Footer from "../../components/footer";
import ScrollTop from "../../components/scrollTop";
import { useMutation } from "@tanstack/react-query";
import api from "../../api/http";

export default function Recharge() {
  const [amount, setAmount] = useState("");

  const handleInputChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePayment();
  };

  const paymentMutation = useMutation({
    mutationFn: (formData) => {
      return api.post("payment/pay", formData);
    },
  });

  const handlePayment = () => {
    const formData = {
      amount,
      currency: "USD",
      bankCoded: "",
      language: "vn",
    };
    onfinish(formData);
  };

  const onfinish = (body) => {
    paymentMutation.mutate(body, {
      onSuccess: (response) => {
        window.location.href = response.data.data;
      },
    });
  };

  return (
    <>
      <Navbar />
      <section
        className="bg-half-170 d-table w-100"
        style={{ backgroundImage: `url(${bg1})`, backgroundPosition: "top" }}
      >
        <div className="bg-overlay bg-gradient-overlay"></div>
        <div className="container">
          <div className="row mt-5 justify-content-center">
            <div className="col-12">
              <div className="title-heading text-center">
                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
                  Nạp Tiền Vào Tài Khoản
                </h5>
              </div>
            </div>
          </div>

          <div className="position-middle-bottom">
            <nav aria-label="breadcrumb" className="d-block">
              <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                <li className="breadcrumb-item">
                  <Link to="https://topjob.id.vn">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Deposit
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>
      <div className="position-relative">
        <div className="shape overflow-hidden text-white">
          <svg
            viewBox="0 0 2880 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-12">
              <div className="card shadow">
                <div className="card-body">
                  <h5 className="card-title text-center">Nạp Tiền</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="amount">Số Tiền Cần Nạp</label>
                      <input
                        type="number"
                        className="form-control"
                        id="amount"
                        value={amount}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập số tiền"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-block mt-3"
                    >
                      Nạp Tiền
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-100 mt-60">
          <Faq />
        </div>
      </section>
      <Footer />
      <ScrollTop />
    </>
  );
}
