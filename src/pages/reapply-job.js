import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation } from "@tanstack/react-query";
import bg1 from "../assets/images/hero/bg.jpg";
import logo1 from "../assets/images/company/lenovo-logo.png";
import useJobSeekerInfo from "../hook/useJobSeekerInfo";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";
import api from "../api/http";
import useJobInfo from "../hook/useJobInfo";
export default function JobApply() {
  const { jobId } = useParams();
  const { data: userData } = useJobSeekerInfo();
  const user = userData?.data;
  const { data: jobDat } = useJobInfo(jobId);
  const job = jobDat?.data; // Extract job data from URL

  const token = sessionStorage.getItem("token");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [jobType, setJobType] = useState("All Jobs");
  const [description, setDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const applyResumeMutation = useMutation({
    mutationFn: (formData) => {
      return api.patch(`jobSeeker/reapply-cv/${job.enterprise.eid}`, formData, {
        headers: {
          Authorization: token,
        },
      });
    },
  });

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.user.email || "");
      setPhone(user.phone || "");
      setFullName(`${user.first_name} ${user.last_name}` || "");
      // setResume(user.resume_url || "");
    }

    if (job) {
      setOccupation(job?.title || "Game over");
      setJobType(job?.jobTypeEntity?.jobTypeName || "Go Home"); // Check if job.jobType is defined
    }
  }, [user, job]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && isAllowed(file)) {
      const reader = new FileReader();

      reader.onload = function (event) {
        console.log("event nested: ", event);
        console.log("event nested-1: ", event.target);
        console.log("event nested-2: ", event.target.result);

        const dataURL = event.target.result;
        console.log("Data URL:", dataURL);

        // You can now use the dataURL as needed, e.g., to display an image.
        setResume(dataURL);
      };

      // Read the file as a Data URL
      reader.readAsDataURL(file);
    } else {
      toast.error("Invalid File Format");
    }
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!isAccepted) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("job", occupation);
      formData.append("jobType", jobType);
      formData.append("description", `<p>${description}</p>`);

      if (resume) {
        try {
          console.log("resume: ", resume);
          formData.append("resume_url", resume);
        } catch (error) {
          console.error("Error reading file", error);
        }
      }

      applyResumeMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Applying successfully");
        },
        onError: (error) => {
          toast.error("Error applying: " + error.message);
        },
      });
    }
  };

  const handleCheckboxChange = (event) => {
    setIsAccepted(event.target.checked);
    setShowWarning(false); // Reset warning when checkbox state changes
  };

  return (
    <>
      <Navbar navClass="defaultscroll sticky" navLight={true} />
      <section
        className="bg-half-170 d-table w-100"
        style={{ backgroundImage: `url(${bg1})`, backgroundPosition: "top" }}
      >
        <div className="bg-overlay bg-gradient-overlay"></div>
        <div className="container">
          <div className="row mt-5 justify-content-center">
            <div className="col-12">
              <div className="title-heading text-center">
                <img
                  src={
                    job?.enterprise?.avatar_url
                      ? job.enterprise.avatar_url
                      : logo1
                  }
                  className="avatar avatar-small rounded-pill p-2 bg-white"
                  alt=""
                />
                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark mt-3">
                  {job?.title ? job.title : "Back-End Developer"}
                </h5>
              </div>
            </div>
          </div>

          <div className="position-middle-bottom">
            <nav aria-label="breadcrumb" className="d-block">
              <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                <li className="breadcrumb-item">
                  <Link to="/">TopJob</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/job-grid-two">Job</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Job Apply
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

      <section className="section bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7 col-md-7">
              <div className="card border-0">
                <form
                  className="rounded shadow p-4"
                  onSubmit={handleApplySubmit}
                >
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Your Name :<span className="text-danger">*</span>
                        </label>
                        <input
                          name="name"
                          id="name2"
                          type="text"
                          className="form-control"
                          placeholder="First Name :"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb3">
                        <label className="form-label fw-semibold">
                          Your Email :<span className="text-danger">*</span>
                        </label>
                        <input
                          name="email"
                          id="email2"
                          type="email"
                          className="form-control"
                          placeholder="Your email :"
                          value={email}
                          disabled={true}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Your Phone no. :<span className="text-danger">*</span>
                        </label>
                        <input
                          name="number"
                          id="number2"
                          type="text"
                          className="form-control"
                          placeholder="Your phone no. :"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Job Title :
                        </label>
                        <input
                          name="subject"
                          id="subject2"
                          className="form-control"
                          placeholder="Title :"
                          value={occupation}
                          disabled={true}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Types of jobs :
                        </label>
                        <input
                          className="form-control "
                          name="jobType"
                          id="jobType"
                          value={jobType}
                          disabled={true}
                        ></input>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Description :
                        </label>
                        <textarea
                          name="comments"
                          id="comments"
                          rows="4"
                          className="form-control"
                          placeholder="Describe yourself..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Upload Your CV :<span className="text-danger">*</span>
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                            checked={isAccepted}
                            onChange={handleCheckboxChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                            I Accept{" "}
                            <Link to="#" className="text-primary">
                              Terms And Conditions
                            </Link>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <input
                          type="submit"
                          id="submit2"
                          name="send"
                          className="submitBtn btn btn-primary"
                          value="ReApply"
                          style={{
                            opacity: isAccepted ? 1 : 0.5,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </form>
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
