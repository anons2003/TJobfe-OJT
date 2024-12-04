import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import useJobSeekerInfo from "../hook/useJobSeekerInfo";
import useEnterpriseInfo from "../hook/useEnterpriseInfo";
export const ContactUs = () => {
  const { jid } = useParams();
  const { data: enterpriseData } = useEnterpriseInfo();
  const enterprise = enterpriseData?.data;
  const { data: jobSeekerData } = useJobSeekerInfo();
  const jobSeeker = jobSeekerData?.data;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    body: "",
    file: null,
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastSentTime, setLastSentTime] = useState(null);
  const COOL_DOWN_TIME = 10 * 60 * 1000;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files : value,
    }));
  };

  useEffect(() => {
    const storedLastSentTime = sessionStorage.getItem("lastSentTime");
    if (storedLastSentTime) {
      setLastSentTime(storedLastSentTime);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const now = new Date();
    // if (lastSentTime && now - new Date(lastSentTime) < COOL_DOWN_TIME) {
    //   setErrorMessage("You can only send one message every 10 minutes");
    //   return;
    // }

    const data = new FormData();
    for (let key in formData) {
      if (formData[key]) {
        if (key === "file") {
          for (let i = 0; i < formData.file.length; i++) {
            data.append(key, formData.file[i]);
          }
        } else {
          data.append(key, formData[key]);
        }
      }
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/jobSeeker/send/${jid}`,
        data
      );
      if (response.status === 200) {
        setIsSuccess(true);
        setErrorMessage("");
        sessionStorage.setItem("lastSentTime", new Date());
      }
    } catch (error) {
      setIsSuccess(false);
      setErrorMessage("Failed to send email. Please try again.");
      console.error("Error sending email:", error);
    }
  };

  return (
    <>
      {isSuccess ? (
        <div className="alert alert-success" role="alert">
          Your message has been sent successfully.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Your Name <span className="text-danger">*</span>
                </label>
                <input
                  name="name"
                  id="name"
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={
                    enterprise
                      ? (formData.name = enterprise?.name)
                      : jobSeeker
                        ? (formData.name =
                          jobSeeker?.first_name + " " + jobSeeker?.last_name)
                        : formData.name
                  }
                  onChange={handleChange}
                  required
                  disabled
                  readOnly
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Your Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  id="email"
                  name="email"
                  value={
                    enterprise
                      ? (formData.email = enterprise?.user.email)
                      : jobSeeker
                        ? (formData.email = jobSeeker?.user.email)
                        : formData.email
                  }
                  onChange={handleChange}
                  required
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="col-12">
              <div className="mb-3">
                <label className="form-label fw-semibold">Subject</label>
                <input
                  name="subject"
                  id="subject"
                  className="form-control"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  type="text"
                />
              </div>
            </div>

            <div className="col-12">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Comments <span className="text-danger">*</span>
                </label>
                <textarea
                  name="body"
                  id="body"
                  rows={4}
                  className="form-control"
                  placeholder="Message"
                  value={formData.body}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
    </>
  );
};
