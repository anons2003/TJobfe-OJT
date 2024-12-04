import React from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ScrollTop from "../../components/scrollTop";
import { FiClock, FiDollarSign } from "../../assets/icons/vander";
import { South } from "@mui/icons-material";

const token = sessionStorage.getItem("token");

export default function TransactionHistory() {
  const [transactions, setTransactions] = React.useState([
    {
      id: 1,
      date: "2024-07-01",
      description: "Bought groceries",
      amount: "-$50.00",
      type: "expense",
    },
    {
      id: 2,
      date: "2024-07-02",
      description: "Salary",
      amount: "+$2000.00",
      type: "income",
    },
    {
      id: 3,
      date: "2024-07-03",
      description: "Electricity bill",
      amount: "-$75.00",
      type: "expense",
    },
  ]);

  const fetchTransactions = async () => {
    await fetch("https://topjob-ojt-790cf940c139.herokuapp.com/payment/history", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((data) => data.json())
      .then((data) => setTransactions(data));
  };

  React.useEffect(() => {
    fetchTransactions();
  }, [transactions]);

  return (
    <>
      <Navbar navClass="defaultscroll sticky" />

      <section className="bg-half-170 d-table w-100 bg-primary">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-6">
              <div className="title-heading">
                <h1 className="heading text-white fw-bold">
                  Transaction History
                </h1>
                <p className="para-desc text-white-50 mb-0">
                  View your past transactions and keep track of your expenses
                  and income.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container mt-100 mt-60">
          <div className="row align-items-end mb-4 pb-2">
            <div className="col-lg-6 col-md-9">
              <div className="section-title text-md-start text-center">
                <h4 className="title mb-3">Recent Transactions</h4>
                <p className="text-muted para-desc mb-0">
                  Here you can view your most recent transactions.
                </p>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-0">
            {transactions.map((transaction, index) => (
              <div className="col-lg-4 col-md-6 col-12" key={index}>
                <div
                  className={`transaction-post rounded shadow p-4 ${
                    transaction.type === "deposit"
                      ? "bg-soft-success"
                      : "bg-soft-danger"
                  }`}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="ms-3">
                        <span className="h5 transaction-description text-dark">
                          {transaction.description}
                        </span>
                        <span className="text-muted d-flex align-items-center small mt-2">
                          <FiClock className="fea icon-sm me-1" />{" "}
                          {new Date(transaction.created_at * 1).toUTCString()}
                        </span>
                      </div>
                    </div>

                    <span className="badge bg-soft-primary">
                      {transaction.type === "deposit" ? "+" : "-"}$
                      {transaction.amount}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="col-12 d-md-none d-block">
              <div className="text-center">
                <Link
                  to="/all-transactions"
                  className="btn btn-link primary text-muted"
                >
                  See All Transactions <i className="mdi mdi-arrow-right"></i>
                </Link>
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
