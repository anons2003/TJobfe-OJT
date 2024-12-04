import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import NavbarDark from "../../components/navbarDark";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from '../../api/http';
function JobSeekersTable() {
  const [category, setCategory] = useState("");
  const [jobType, setJobType] = useState("");
  const [status, setStatus] = useState(""); // Added state for CV status
  const [jobSeekersData, setJobSeekersData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [resumeContent, setResumeContent] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedJobSeeker, setSelectedJobSeeker] = useState(null);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [otherReason, setOtherReason] = useState("");

  const [jobTypes, setJobTypes] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);

  const reasons = [
    "Incomplete Application",
    "Not Qualified",
    "Overqualified",
    "Position Filled",
    "Insufficient Experience",
    "Poor Cultural Fit",
    "Other",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/enterprises/get-cv-applied",
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setJobSeekersData(response.data);
      } catch (error) {
        toast.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const jobTypesResponse = await api.get("/job-types", {
          headers: { Authorization: token },
        });
        const jobCategoriesResponse = await api.get("/job-categories", {
          headers: { Authorization: token },
        });
        setJobTypes(jobTypesResponse.data);
        setJobCategories(jobCategoriesResponse.data);
      } catch (error) {
        toast.error("Error fetching job types and categories", error);
      }
    };

    fetchFilterData();
  }, []);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleJobTypeChange = (event) => {
    setJobType(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value); // Update status filter
  };

  const handleResumeClick = (resumeUrl) => {
    setResumeContent(resumeUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setResumeContent("");
  };

  const handleAcceptCV = async (uid) => {
    if (!doNotShowAgain) {
      setSelectedJobSeeker(uid);
      setShowConfirmModal(true);
    } else {
      acceptCV(uid);
    }
  };

  const acceptCV = async (uid) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:8080/enterprises/accept-cv/${uid}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success(response.data);
      updateJobSeekerStatus(uid, 1);
    } catch (error) {
      toast.error("Error accepting CV", error);
    }
  };

  const handleRejectCV = (uid) => {
    setSelectedJobSeeker(uid);
    setSelectedReasons([]);
    setOtherReason("");
    setShowReasonModal(true);
  };

  const rejectCV = async (uid, rejectionReasons) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:8080/enterprises/reject-cv/${uid}`,
        { reasons: rejectionReasons },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success(response.data);
      updateJobSeekerStatus(uid, -1);
    } catch (error) {
      toast.error("Error rejecting CV", error);
    }
  };

  const handleConfirmAccept = () => {
    if (doNotShowAgain) {
      sessionStorage.setItem("doNotShowAcceptConfirm", "true");
    }
    setShowConfirmModal(false);
    acceptCV(selectedJobSeeker);
  };

  const handleReasonChange = (reason) => {
    const isSelected = selectedReasons.includes(reason);
    if (isSelected) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
    } else {
      if (selectedReasons.length < 3) {
        setSelectedReasons([...selectedReasons, reason]);
      }
    }
  };

  const handleReasonSubmit = () => {
    const rejectionReasons = selectedReasons.includes("Other")
      ? [...selectedReasons.filter((r) => r !== "Other"), otherReason]
      : selectedReasons;
    setShowReasonModal(false);
    rejectCV(selectedJobSeeker, rejectionReasons);
  };

  const updateJobSeekerStatus = (uid, status) => {
    setJobSeekersData((prevData) =>
      prevData.map((jobSeeker) =>
        jobSeeker.jobSeeker.user.uid === uid
          ? { ...jobSeeker, isApllied: status }
          : jobSeeker
      )
    );
  };

  const filteredJobSeekers = jobSeekersData.filter((jobSeeker) => {
    const statusCondition =
      status === "" && jobSeeker.isApllied === 0
        ? true
        : (status === "Accepted" && jobSeeker.isApllied === 1) ||
        (status === "Rejected" && jobSeeker.isApllied === -1) ||
        status === "All";

    return (
      (category ? jobSeeker.job === category : true) &&
      (jobType ? jobSeeker.jobType === jobType : true) &&
      statusCondition
    );
  });

  useEffect(() => {
    const doNotShow = sessionStorage.getItem("doNotShowAcceptConfirm");
    setDoNotShowAgain(doNotShow === "true");
  }, []);
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resumeContent;
    link.download = "resume";
    link.click();
  };
  return (
    <>
      <NavbarDark />
      <section className="section container mt-4">
        <h1>Job Seekers</h1>
        <div className="row mb-3">
          <div className="col-md-3">
            <label htmlFor="category" className="form-label">
              Filter by Category
            </label>
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">All</option>
              {jobCategories.map((jobCategory) => (
                <option key={jobCategory.jobCategoryId} value={jobCategory.jobCategoryName}>
                  {jobCategory.jobCategoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="jobType" className="form-label">
              Filter by Job Type
            </label>
            <select
              id="jobType"
              className="form-select"
              value={jobType}
              onChange={handleJobTypeChange}
            >
              <option value="">All</option>
              {jobTypes.map((jobType) => (
                <option key={jobType.jobTypeId} value={jobType.jobTypeName}>
                  {jobType.jobTypeName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="status" className="form-label">
              Filter by Status
            </label>
            <select
              id="status"
              className="form-select"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="All">All</option>
            </select>
          </div>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Job</th>
              <th>Job Type</th>
              <th>Description</th>
              <th>Status</th> {/* Added Status Column */}
              <th>Resume</th>
              <th>Actions</th> {/* Add a new column for actions */}
            </tr>
          </thead>
          <tbody>
            {filteredJobSeekers.map((jobSeeker) => {
              const statusText =
                jobSeeker.isApllied === 1
                  ? "Accepted"
                  : jobSeeker.isApllied === -1
                    ? "Rejected"
                    : "Pending";
              const statusColor =
                jobSeeker.isApllied === 1
                  ? "green"
                  : jobSeeker.isApllied === -1
                    ? "red"
                    : "black";

              return (
                <tr key={jobSeeker.cvId}>
                  <td>
                    <Link
                      to={`/candidate-profile/${jobSeeker?.jobSeeker.jid}`}
                      className="text text-dark"
                    >
                      <h5>{jobSeeker.full_name}</h5>{" "}
                    </Link>
                  </td>
                  <td>{jobSeeker.email}</td>
                  <td>{jobSeeker.phone || "N/A"}</td>
                  <td>{jobSeeker.job}</td>
                  <td>{jobSeeker.jobType}</td>
                  <td
                    dangerouslySetInnerHTML={{ __html: jobSeeker.description }}
                  ></td>
                  <td style={{ color: statusColor }}>{statusText}</td>
                  <td>
                    {jobSeeker.resume_url ? (
                      jobSeeker.resume_url.startsWith("data:image/") ? (
                        <button
                          onClick={() =>
                            handleResumeClick(jobSeeker.resume_url)
                          }
                          style={{ borderStyle: "none" }}
                          className="tw-text-blue-600"
                        >
                          View Resume
                        </button>
                      ) : (
                        <p>Invalid URL</p>
                      )
                    ) : (
                      <p className="text text-muted">No Resume</p>
                    )}
                  </td>
                  <td>
                    <p>
                      {jobSeeker.isApllied !== 1 && (
                        <button
                          className="btn btn-primary me-2"
                          onClick={() =>
                            handleAcceptCV(jobSeeker.jobSeeker.user.uid)
                          }
                        >
                          Accept
                        </button>
                      )}
                      {jobSeeker.isApllied !== -1 && (
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleRejectCV(jobSeeker.jobSeeker.user.uid)
                          }
                        >
                          Reject
                        </button>
                      )}{" "}
                    </p>{" "}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Resume Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Resume</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {resumeContent.startsWith("data:image/") ? (
              <img src={resumeContent} alt="Resume" style={{ width: "100%" }} />
            ) : (
              <iframe
                src={resumeContent}
                title="Resume"
                style={{ width: "100%", height: "500px" }}
              ></iframe>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleDownload}>
              Download
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Confirm Accept Modal */}
        <Modal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Acceptance</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to accept this CV?</p>
            <Form.Check
              type="checkbox"
              label="Do not show this again"
              checked={doNotShowAgain}
              onChange={(e) => setDoNotShowAgain(e.target.checked)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmAccept}>
              Accept
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Reason Modal */}
        <Modal show={showReasonModal} onHide={() => setShowReasonModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Reason for Rejection</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Choose at most 3 reasons</p>
            <Form>
              {reasons.map((reason) => (
                <Form.Check
                  type="checkbox"
                  key={reason}
                  label={reason}
                  checked={selectedReasons.includes(reason)}
                  onChange={() => handleReasonChange(reason)}
                  disabled={
                    selectedReasons.length >= 3 &&
                    !selectedReasons.includes(reason)
                  }
                />
              ))}
              {selectedReasons.includes("Other") && (
                <Form.Group controlId="otherReasonInput" className="mt-3">
                  <Form.Label>Other Reason</Form.Label>
                  <Form.Control
                    type="text"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                  />
                </Form.Group>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowReasonModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleReasonSubmit}
              disabled={selectedReasons.length === 0}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </section>
    </>
  );
}

export default JobSeekersTable;
