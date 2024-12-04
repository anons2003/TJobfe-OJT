import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ScrollTop from "../../components/scrollTop";
import bg1 from "../../assets/images/hero/bg.jpg";
const token = sessionStorage.getItem("token");

export default function PaymentResult() {
  const location = useLocation();
  const [params, setParams] = useState(new URLSearchParams(location.search));
  const [fields, setFields] = useState({});
  const [signValue, setSignValue] = useState("failed");

  useEffect(() => {
    const fetchData = async () => {
      let fieldMap = {};
      for (let param of params.entries()) {
        const [key, value] = param;
        fieldMap[key] = value;
      }
      setFields(fieldMap);
      const result = await fetchSignValue(fieldMap);
      setSignValue(result);
    };

    fetchData();
    window.location.href = "/history";
  }, [params]);

  const fetchSignValue = async (fields) => {
    console.log(1123);
    const response = await fetch("http://localhost:8080/payment/return", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });
    // return response.text
    return response.text();
  };

  const isTransactionSuccessful = () => {
    if (params.get("vnp_ResponseCode") === "00") {
      alert("Giao dịch thành công");
      return "Giao dịch thành công";
    }
    alert("Giao dịch thất bại");
    return "Giao dịch thất bại";
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
                  KẾT QUẢ THANH TOÁN
                </h5>
              </div>
            </div>
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
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-center">Kết quả thanh toán </h5>
              <div className="table-responsive">
                <div className="form-group">
                  <label>Mã giao dịch thanh toán:</label>
                  <b>
                    <label>{params.get("vnp_TxnRef")}</label>
                  </b>
                </div>
                <div className="form-group">
                  <label>Số tiền: </label>
                  <b>
                    <label>{params.get("vnp_Amount")}</label>
                  </b>
                </div>
                <div className="form-group">
                  <label>Mô tả giao dịch: </label>
                  <b>
                    <label>{params.get("vnp_OrderInfo")}</label>
                  </b>
                </div>
                <div className="form-group">
                  <label>Mã giao dịch tại CTT VNPAY-QR: </label>
                  <b>
                    <label>{params.get("vnp_TransactionNo")}</label>
                  </b>
                </div>
                <div className="form-group">
                  <label>Mã ngân hàng thanh toán: </label>
                  <b>
                    <label>{params.get("vnp_BankCode")}</label>
                  </b>
                </div>
                <div className="form-group">
                  <label>Thời gian thanh toán: </label>
                  <b>
                    <label>{params.get("vnp_PayDate")}</label>
                  </b>
                </div>
                <div className="form-group">
                  <label>Tình trạng giao dịch: </label>
                  <b>
                    <label>{isTransactionSuccessful()}</label>
                  </b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <ScrollTop />
    </>
  );
}
