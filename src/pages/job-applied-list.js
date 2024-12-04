import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import NavbarDark from "../components/navbarDark";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import api from "../api/http";

const fetchAppliedCVs = async () => {
  const token = sessionStorage.getItem("token");
  const { data } = await axios.get("https://topjob-ojt-790cf940c139.herokuapp.com/jobSeeker/get-cvs", {
    headers: {
      Authorization: token,
    },
  });
  return data;
};

const CVList = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = React.useState(false);
  const [resumeContent, setResumeContent] = React.useState("");

  const deleteCVMutation = useMutation({
    mutationFn: (cvId) => {
      const token = sessionStorage.getItem("token");
      return api.delete(`/jobSeeker/delete-cv/${cvId}`, {
        headers: {
          Authorization: token,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("appliedCVs");
    },
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ["appliedCVs"],
    queryFn: fetchAppliedCVs,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleResumeClick = (resumeUrl) => {
    setResumeContent(resumeUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setResumeContent("");
  };

  // Map `isApplied` field to status text and color
  const getStatusProps = (isApplied) => {
    switch (isApplied) {
      case 1:
        return { text: "Accepted", color: "green" };
      case -1:
        return { text: "Rejected", color: "red" };
      default:
        return { text: "Pending", color: "black" };
    }
  };

  return (
    <>
      <NavbarDark navClass="defaultscroll sticky" navLight={true} />
      <section className="section container mt-4">
        <h2 className="my-4">CV Applied List</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Enterprise</th>
              <th>Full Name</th>
              <th>Job Type</th>
              <th>Description</th>
              <th>Status</th> {/* Added Status Column */}
              <th>Resume</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((cv) => {
              const { text, color } = getStatusProps(cv.isApllied);
              return (
                <tr key={cv.cvId}>
                  <td>
                    <img
                      src={cv.enterprise.avatar_url}
                      alt="Enterprise"
                      className="avatar avatar-small rounded shadow bg-white"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td>{cv.full_name}</td>
                  <td>{cv.jobType}</td>
                  <td dangerouslySetInnerHTML={{ __html: cv.description }}></td>
                  <td style={{ color }}>{text}</td> {/* Styled Status Text */}
                  <td>
                    {cv.resume_url ? (
                      cv.resume_url.startsWith("data:image/") ? (
                        <button
                          onClick={() => handleResumeClick(cv.resume_url)}
                          style={{ borderStyle: "none" }}
                        >
                          View Resume
                        </button>
                      ) : (
                        <p>Invalid Resume URL</p>
                      )
                    ) : (
                      "No Resume"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => deleteCVMutation.mutate(cv.enterprise.eid)}
                    >
                      Delete
                    </button>

                    <Link
                      to={`/reapply-job/${cv.enterprise.eid}`}
                      className="btn btn-primary btn-sm"
                    >
                      Update
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

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
          </Modal.Footer>
        </Modal>
      </section>
    </>
  );
};

export default CVList;
