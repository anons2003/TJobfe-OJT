//Part 1:

import { useEffect, useState } from "react";

import api from "../../api/http";
import bg1 from "../../assets/images/hero/bg5.jpg";
import useJobSeekerInfo from "../../hook/useJobSeekerInfo";
import NavbarDark from "../../components/navbarDark";
import Footer from "../../components/footer";
import ScrollTop from "../../components/scrollTop";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input, Modal, notification } from "antd";
import Loading from "../../components/loading";
import { FiCamera } from "../../assets/icons/vander";
import NotificationSettings from "../../components/notification-setting/notificationSettings";
import RichTextEditor from "../../components/richtexteditor/RichTextEditor";
import { toast } from "react-toastify";
import StateCitySelector from "../../components/state-city-selector/State_City";
import Selector from "../../components/state-city-selector/Selector";
import axios from "axios";
export default function CandidateProfileSetting() {
  const [jobCategories, setJobCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const jobCategoriesResponse = await axios.get(
          "http://localhost:8080/job-categories"
        );
        setJobCategories(jobCategoriesResponse.data);
      } catch (error) {
        console.error("There was an error fetching the job categories:", error);
      }
    }
    fetchData();
  }, []);

  const queryClient = useQueryClient();
  const token = sessionStorage.getItem("token");
  const { data: userData } = useJobSeekerInfo();
  const user = userData?.data;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [phone, setPhone] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [intro, setIntro] = useState("");
  const [dob, setDob] = useState(""); // Complete the definition
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState({}); // Define errors state

  const updateUserInfoMutation = useMutation({
    mutationFn: (body) => {
      return api.patch("/jobSeeker/update-info", body, {
        headers: {
          Authorization: token,
        },
      });
    },
  });

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setEmail(user.user.email);
      setStateName(user.state);
      setCityName(user.city);
      setIntro(user.intro);
      setOccupation(user.occupation);
      setPhone(user.phone);
      setWebUrl(user.web_url);
      setGender(user.gender);
      setDob(user.dob);
    }
  }, [user]);

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

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    updateUserInfo(); // Trigger user info update
  };

  function updateUserInfo() {
    if (validateForm()) {
      const body = {
        state: stateName,
        city: cityName,
        first_name: firstName,
        last_name: lastName,
        email: email,
        occupation: occupation,
        intro: intro,
        dob: dob,
        gender: gender,
        resume_url: resume,
      };

      updateUserInfoMutation.mutate(body, {
        onSuccess: (data) => {
          toast.success("User info updated successfully:");
        },
        onError: (error) => {
          toast.error("Error updating user info:");
        },
      });
    }
  }

  const firstNameRegex = /^[a-zA-Z\u00C0-\u017F\s]+$/u;

  const lastNameRegex = /^[a-zA-Z]/u;
  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    // Validate First Name using regex
    if (!firstNameRegex.test(firstName.trim())) {
      errorsCopy.firstName = "Invalid First Name";
      valid = false;
      toast.error("Please enter a valid first name!");
    }

    // Validate Last Name using regex
    if (!lastNameRegex.test(lastName.trim())) {
      errorsCopy.lastName = "Invalid Last Name";
      valid = false;
      toast.error("Please enter a valid last name!");
    }
    const today = new Date();
    const dobDate = new Date(dob);

    if (dobDate > today) {
      errorsCopy.dob = "Date of Birth cannot be in the future";
      valid = false;
      toast.error("Date of Birth cannot be in the future!");
    } else {
      // Optional: Check minimum age requirement
      const minAge = 18; // Example minimum age
      const maxAge = 75;
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      if (age < minAge) {
        valid = false;
        toast.error(`You must be at least ${minAge} years old!`);
      }
      if (age > maxAge) {
        valid = false;
        toast.error(`You must be no older than ${maxAge} years old!`);
      }
    }

    setErrors(errorsCopy);

    return valid;
  }
  //Contact Info Update
  const updateContactInfo = useMutation({
    mutationFn: (body) => {
      return api.patch("/jobSeeker/update-contact-info", body, {
        headers: {
          Authorization: token,
        },
      });
    },
  });

  const handleSubmitContactInfo = (e) => {
    e.preventDefault();
    if (validateContactForm()) {
      const body = {
        phone: phone,
        web_url: webUrl,
      };

      updateContactInfo.mutate(body, {
        onSuccess: (data) => {
          toast.success("Contact info updated successfully:");
        },
        onError: (error) => {
          toast.error("Error updating contact info");
        },
      });
    }
  };

  function validateContactForm() {
    let valid = true;
    const errorsCopy = {};

    // Validate Phone Number
    if (phone.trim()) {
      // Check if the phone number is in a valid format
      const phoneRegex = /^[0-9]{10}$/; // Assuming a 10-digit phone number format
      if (!phoneRegex.test(phone)) {
        errorsCopy.phone = "Invalid Phone Number Format";
        valid = false;
        toast.error("Please enter correct phone number");
      } else {
        errorsCopy.phone = "";
      }
    } else {
      errorsCopy.phone = "Phone Number is Required";
      valid = false;
    }

    // Set the updated errors object to the state
    setErrors(errorsCopy);

    return valid;
  }
  //  update password

  // Function to handle form submission
  const updatePasswordMutation = useMutation({
    mutationFn: (body) => {
      return api.patch("/update-password", body, {
        headers: {
          Authorization: token,
        },
      });
    },
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatePasswrodForm()) {
      const body = { oldPassword, newPassword };
      updatePasswordMutation.mutate(body, {
        onSuccess() {
          toast.success("Updated password successfully");
        },
        onError(error) {
          const errorMessage =
            error.response?.data?.message || "An error occurred";
          toast.error(errorMessage);
        },
      });
    }
  };

  const validatePasswrodForm = () => {
    let valid = true;
    const errorsCopy = {};

    if (!oldPassword.trim()) {
      errorsCopy.oldPassword = "Old Password is Required";
      valid = false;
    }

    if (!newPassword.trim()) {
      errorsCopy.newPassword = "New Password is Required";
      toast.error("New Password is Required");
      valid = false;
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]).{8,}/.test(
        newPassword
      )
    ) {
      errorsCopy.newPassword =
        "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.";
      valid = false;
      toast.error(
        "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character."
      );
    }

    if (!confirmPassword.trim()) {
      errorsCopy.confirmPassword = "Confirm Password is Required";
      valid = false;
      toast.error("New Password is Required");
    } else if (newPassword !== confirmPassword) {
      errorsCopy.confirmPassword = "Passwords do not match";
      valid = false;
      toast.error("New Passwords do not match");
    }

    // Check if new password is same as old password
    if (oldPassword === newPassword) {
      errorsCopy.newPassword =
        "New Password must be different from Old Password";
      valid = false;
      toast.error("New Password must be different from Old Password");
    }

    setErrors(errorsCopy);
    return valid;
  };
  //delete

  // State to track deletion status
  const [showDelModal, setShowDelModal] = useState(false);
  const [deletionStatus, setDeletionStatus] = useState("");

  // Mutation to handle user deletion
  const deleteMutation = useMutation({
    mutationFn: () => {
      return api.delete("/delete-account", {
        headers: {
          Authorization: token,
        },
      });
    },
  });

  // Function to handle user deletion
  const handleDeleteUser = async () => {
    try {
      const response = await deleteMutation.mutateAsync();
      if (response.status === 200) {
        setDeletionStatus("User deleted successfully.");
      } else {
        setDeletionStatus("Error deleting user. Please try again.");
      }
    } catch (error) {
      setDeletionStatus("Error deleting user. Please try again.");
    }
  };
  //
  //Upload CV
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [resume, setResume] = useState(null);

  const uploadAvatar = useMutation({
    mutationFn: (formData) => {
      return api.patch("/jobSeeker/update-avatar", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("USER_PROFILE");
      toast.success("Update avatar successfully");
    },
    onError: () => {
      toast.error("Update avatar failed");
    },
  });

  // Function to handle file selection

  // Function to handle form submission or other action to upload resume

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (!file && !resume) {
      return;
    }

    if (file) {
      let formData = new FormData();
      formData.append("image", file);
      uploadAvatar.mutate(formData);
    }

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const changeNameMutation = useMutation({
    mutationFn: (body) => {
      return api.patch("/jobSeeker/update-profile", body, {
        headers: {
          Authorization: token,
        },
      });
    },
  });

  const showModalName = () => {
    setIsModalNameOpen(true);
  };
  const [isModalNameOpen, setIsModalNameOpen] = useState(false);
  const [name, setName] = useState(user?.user_name);

  useEffect(() => {
    setName(user?.user_name);
    // setAbout(user?.about);
  }, [user]);

  const handleNameOk = () => {
    const body = { puser_name: name };
    changeNameMutation.mutate(body, {
      onSuccess() {
        queryClient.invalidateQueries("USER_PROFILE");
        toast.success("Edit name successfully");
      },
      onError() {
        toast.error("Edit name failed, Try again later");
      },
    });
    setIsModalNameOpen(false);
  };

  const handleNameCancel = () => {
    setIsModalNameOpen(false);
  };

  return (
    <>
      <>
        <NavbarDark />
        <section className="section">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="position-relative">
                  <div className="candidate-cover">
                    <div className="profile-banner relative text-transparent">
                      <input id="pro-banner" />
                      <div className="relative shrink-0">
                        <img
                          src={bg1}
                          className="rounded shadow"
                          id="profile-banner"
                          alt=""
                        />
                        <label
                          className="profile-image-label"
                          htmlFor="pro-banner"
                        ></label>
                      </div>
                    </div>
                  </div>
                  <div className="candidate-profile d-flex align-items-end mx-2">
                    {uploadAvatar.isPending ? (
                      <Loading />
                    ) : (
                      <div className="position-relative">
                        <input
                          type="button"
                          onClick={showModal}
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            opacity: "0.01",
                            zIndex: "11",
                          }}
                        />
                        <div className="position-relative d-inline-block">
                          <img
                            src={user?.avatar_url}
                            className="avatar avatar-medium img-thumbnail rounded-pill shadow-sm"
                            id="profile-image"
                            alt=""
                          />
                          <label
                            className="icons position-absolute bottom-0 end-0"
                            htmlFor="pro-img"
                          >
                            <span className="btn btn-icon btn-sm btn-pills btn-primary">
                              <FiCamera className="icons" />
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                    <div className="ms-2">
                      <h5 className="mb-0">
                        {user?.gender == 0 ? "Mr. " : "Mrs. "}
                        {""}
                        {user?.firstName == null && user?.last_name == null
                          ? user?.user_name
                          : user?.first_name + " " + user?.last_name}
                      </h5>
                      <p className="text-muted mb-0">{user?.occupation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="rounded shadow p-4">
                  <form onSubmit={handleInfoSubmit}>
                    <h5>Personal Detail :</h5>
                    <div className="row mt-4">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            First Name:<span className="text-danger">*</span>
                          </label>
                          <input
                            name="name"
                            id="firstname"
                            type="text"
                            className={`form-control ${errors.firstName} ? "is-invalid" :""`}
                            placeholder="First Name :"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                          {errors.firstName && (
                            <div className="invalid-feedback">
                              {errors.firstName}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Last Name:<span className="text-danger">*</span>
                          </label>
                          <input
                            name="name"
                            id="lastname"
                            type="text"
                            className={`form-control ${errors.lastName} ? "is-invalid" :""`}
                            placeholder="Last Name :"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                          {errors.lastName && (
                            <div className="invalid-feedback">
                              {errors.lastName}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Your Email:
                          </label>
                          <input
                            name="email"
                            id="email2"
                            type="email"
                            className="form-control"
                            placeholder="Your email :"
                            value={email}
                            disabled={true}
                          />{" "}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Occupation:
                          </label>
                          <select
                            className="form-control form-select"
                            id="Type"
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                          >
                            {jobCategories.map((category) => (
                              <option
                                key={category.jobCategoryId}
                                value={category.jobCategoryName}
                              >
                                {category.jobCategoryName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-semibold">
                              Date of Birth:
                            </label>
                            <input
                              className="form-control"
                              type="date"
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-semibold">
                              Gender:
                            </label>
                            <select
                              className="form-select"
                              value={gender}
                              onChange={(e) => setGender(e.target.value)}
                            >
                              <option value="">Select Gender</option>
                              <option value="0">Male</option>
                              <option value="1">Female</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <StateCitySelector
                        stateName={stateName}
                        setStateName={setStateName}
                        cityName={cityName}
                        setCityName={setCityName}
                      />

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="formFile"
                            className="form-label fw-semibold"
                          >
                            Upload Your Cv / Resume :
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            id="formFile"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Introduction :
                          </label>
                          <RichTextEditor value={intro} onChange={setIntro} />
                        </div>
                      </div>

                      <div className="col-12">
                        <input
                          type="submit"
                          id="submit2"
                          name="send"
                          className="submitBnt btn btn-primary"
                          value="Save Changes"
                        />
                      </div>
                    </div>
                  </form>
                </div>

                <div className="rounded shadow p-4 mt-4">
                  <div className="row">
                    <div className="col-md-6 mt-4 pt-2">
                      <h5>Contact Info :</h5>

                      <form onSubmit={handleSubmitContactInfo}>
                        <div className="row mt-4">
                          <div className="col-lg-12">
                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                Phone No.:
                              </label>
                              <input
                                name="number"
                                id="number"
                                type="text"
                                className="form-control"
                                placeholder="Phone :"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                              />
                              {errors.phone && (
                                <div className="invalid-feedback">
                                  {errors.phone}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-lg-12">
                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                Website:
                              </label>
                              <input
                                name="url"
                                id="url"
                                type="url"
                                className="form-control"
                                placeholder="Url :"
                                value={webUrl}
                                onChange={(e) => setWebUrl(e.target.value)}
                              />
                              {errors.webUrl && (
                                <div className="invalid-feedback">
                                  {errors.webUrl}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-lg-12 mt-2 mb-0">
                            <button type="submit" className="btn btn-primary">
                              Update Contact Info
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>

                    <div className="col-md-6 mt-4 pt-2">
                      <h5>Change password :</h5>
                      <form onSubmit={handleSubmit}>
                        <div className="row mt-4">
                          <div className="col-lg-12">
                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                Old password :
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Old password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                              />
                              {errors.oldPassword && (
                                <div className="invalid-feedback">
                                  {errors.oldPassword}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                New password :
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                              {errors.newPassword && (
                                <div className="invalid-feedback">
                                  {errors.newPassword}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                Confirm password :
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                              />
                              {errors.confirmPassword && (
                                <div className="invalid-feedback">
                                  {errors.confirmPassword}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 mt-2 mb-0">
                            <button type="submit" className="btn btn-primary">
                              Save password
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="rounded shadow p-4 mt-4">
                  <NotificationSettings />
                </div>
                <div>
                  <form>
                    <h5 className="text-danger">Delete Account :</h5>
                    <div className="row mt-4">
                      <h6 className="mb-0">
                        Do you want to delete the account? Please press below
                        "Delete" button
                      </h6>
                      <div className="mt-4">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => setShowDelModal(true)}
                          disabled={deleteMutation.isLoading}
                        >
                          {deleteMutation.isLoading
                            ? "Deleting..."
                            : "Delete Account"}
                        </button>
                        {deletionStatus && <p>{deletionStatus}</p>}
                      </div>
                    </div>
                  </form>
                  {showDelModal && (
                    <div
                      className="modal"
                      tabIndex="-1"
                      role="dialog"
                      style={{ display: "block" }}
                    >
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Confirm Deletion</h5>
                            <button
                              type="button"
                              className="close"
                              onClick={() => setShowDelModal(false)}
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            Are you sure you want to delete your account?
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowDelModal(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={handleDeleteUser}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer top={true} />
        <ScrollTop />
      </>{" "}
      <Modal
        title="Update avatar ?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          type="file"
          placeholder="Choose avatar"
        />
      </Modal>
      <Modal
        title="Edit name"
        open={isModalNameOpen}
        onOk={handleNameOk}
        onCancel={handleNameCancel}
      >
        <Input
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="New name"
        />
      </Modal>
    </>
  );
}
