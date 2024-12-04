import { useEffect, useState } from "react";

import api from "../../api/http";
import bg1 from "../../assets/images/hero/bg4.jpg";
import useEnterpriseInfo from "../../hook/useEnterpriseInfo";
import NavbarDark from "../../components/navbarDark";
import Footer from "../../components/footer";
import ScrollTop from "../../components/scrollTop";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input, Modal, notification } from "antd";
import Loading from "../../components/loading";
import { FiCamera } from "../../assets/icons/vander";
import NotificationSettings from "../../components/notification-setting/notificationSettings";
import RichTextEditor from "../../components/richtexteditor/RichTextEditor";

export default function EnterpriseProfileSetting() {
  const queryClient = useQueryClient();
  const token = sessionStorage.getItem("token");
  const { data: enterpriseData } = useEnterpriseInfo();
  const user = enterpriseData?.data;

  const [enterpriseName, setEnterpriseName] = useState("");
  const [founder, setFounder] = useState("");
  const [headquarter, setHeadquarter] = useState("");
  const [city, setCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [founded, setFounded] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [companyStory, setCompanyStory] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState("");

  const updateUserInfoMutation = useMutation({
    mutationFn: (body) => {
      return api.patch("/enterprises/update-info", body, {
        headers: {
          Authorization: token,
        },
      });
    },
  });

  useEffect(() => {
    if (user) {
      console.log("User data loaded:", user);
      setEnterpriseName(user.enterprise_name || "");
      setFounder(user.founder || "");
      setHeadquarter(user.headquarter || "");
      setSelectedState(user.state || "");
      setCompanyStory(user.companyStory || "");
      setCity(user.city || "");
      setFounded(user.founded || "");
      setWebUrl(user.web_url || "");
      setPhone(user.phone || "");
      setEmployees(user.employees || "");
    }
  }, [user]);

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with:", {
      enterpriseName,
      founder,
      headquarter,
      selectedState,
      founded,
      webUrl,
      companyStory,
      phone,
      employees,
      city,
    });
    updateUserInfo();
  };

  function updateUserInfo() {
    const body = {
      enterprise_name: enterpriseName,
      founder: founder,
      founded: founded,
      headquarter: headquarter,
      state: selectedState,
      city: city,
      web_url: webUrl,
      employees: employees,
      companyStory: companyStory,
      phone: phone,
    };

    console.log("Sending update request with body:", body);

    updateUserInfoMutation.mutate(body, {
      onSuccess: (data) => {
        console.log("Update Success:", data);
        notification.success({ message: "User info updated successfully:" });
      },
      onError: (error) => {
        console.error("Update Error:", error);
        notification.error({ message: "Error updating user info:" });
      },
    });
  }
  //Contact Info Update
  const updateContactInfo = useMutation({
    mutationFn: (body) => {
      return api.patch("/enterprises/update-contact-info", body, {
        headers: {
          Authorization: token,
        },
      });
    },
  });

  const handleSubmitContactInfo = (e) => {
    e.preventDefault();
    const body = {
      phone: phone,
      web_url: webUrl,
    };

    updateContactInfo.mutate(body, {
      onSuccess: (data) => {
        notification.success({
          message: "Contact info updated successfully:",
        });
      },
      onError: (error) => {
        notification.error({ message: "Error updating contact info:" });
      },
    });
  };

  //  update password

  // Function to handle form submission
  const updatePasswordMutation = useMutation({
    mutationFn: (body) => {
      return api.patch("/enterprises/update-password", body, {
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
          notification.success({ message: "Updated password successfully" });
        },
        onError(error) {
          const errorMessage =
            error.response?.data?.message || "An error occurred";
          notification.error({ message: errorMessage });
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
      notification.error({ message: "New Password is Required" });
      valid = false;
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]).{8,}/.test(
        newPassword
      )
    ) {
      errorsCopy.newPassword =
        "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.";
      valid = false;
      notification.error({
        message:
          "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.",
      });
    }

    if (!confirmPassword.trim()) {
      errorsCopy.confirmPassword = "Confirm Password is Required";
      valid = false;
      notification.error({ message: "New Password is Required" });
    } else if (newPassword !== confirmPassword) {
      errorsCopy.confirmPassword = "Passwords do not match";
      valid = false;
      notification.error({ message: "New Passwords do not match" });
    }

    // Check if new password is same as old password
    if (oldPassword === newPassword) {
      errorsCopy.newPassword =
        "New Password must be different from Old Password";
      valid = false;
      notification.error({
        message: "New Password must be different from Old Password",
      });
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
      return api.delete("/enterprises/delete-account", {
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

  //Upload avatar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);

  const uploadAvatar = useMutation({
    mutationFn: (formData) => {
      return api.patch("/enterprises/update-avatar", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("ENTERPRISE_PROFILE");
      notification.success({ message: "Update avatar successfully" });
    },
    onError: () => {
      notification.error({ message: "Update avatar failed" });
    },
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (!file) {
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

  console.log("data from backend", user);
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
                      <h5 className="mb-0">{user?.enterprise_name}</h5>
                      <p className="text-muted mb-0">
                        {user?.city}, {user?.state}
                      </p>
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
                    <h5>Company Detail :</h5>
                    <div className="row mt-4">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Enterprise Name:
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            name="name"
                            id="EnterpriseName"
                            type="text"
                            className="form-control"
                            placeholder="Enterprise Name :"
                            value={enterpriseName}
                            onChange={(e) => setEnterpriseName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Founder:<span className="text-danger">*</span>
                          </label>
                          <input
                            name="name"
                            id="Founder"
                            type="text"
                            className="form-control"
                            placeholder="Founder :"
                            value={founder}
                            onChange={(e) => setFounder(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Founded:<span className="text-danger">*</span>
                          </label>
                          <input
                            name="founded"
                            id="Founded"
                            type="text"
                            className="form-control"
                            placeholder="Your Founded Year :"
                            value={founded}
                            onChange={(e) => setFounded(e.target.value)}
                          />{" "}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Employees:<span className="text-danger">*</span>
                          </label>
                          <input
                            name="employees"
                            id="employees"
                            type="text"
                            className="form-control"
                            placeholder="Your total employees :"
                            value={employees}
                            onChange={(e) => setEmployees(e.target.value)}
                          />{" "}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Headquarter:<span className="text-danger">*</span>
                          </label>
                          <input
                            name="headquarter"
                            id="Headquarter"
                            type="text"
                            className="form-control"
                            placeholder="Your Headquarter :"
                            value={headquarter}
                            onChange={(e) => setHeadquarter(e.target.value)}
                          />{" "}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Province:<span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-control form-select"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                          >
                            <option value="">Select Province</option>
                            <option value="An Giang">An Giang</option>
                            <option value="Bà Rịa-Vũng Tàu">
                              Bà Rịa-Vũng Tàu
                            </option>
                            <option value="Bạc Liêu">Bạc Liêu</option>
                            <option value="Bắc Kạn">Bắc Kạn</option>
                            <option value="Bắc Giang">Bắc Giang</option>
                            <option value="Bắc Ninh">Bắc Ninh</option>
                            <option value="Bến Tre">Bến Tre</option>
                            <option value="Bình Dương">Bình Dương</option>
                            <option value="Bình Định">Bình Định</option>
                            <option value="Bình Phước">Bình Phước</option>
                            <option value="Bình Thuận">Bình Thuận</option>
                            <option value="Cà Mau">Cà Mau</option>
                            <option value="Cần Thơ">Cần Thơ</option>
                            <option value="Cao Bằng">Cao Bằng</option>
                            <option value="Đà Nẵng">Đà Nẵng</option>
                            <option value="Đắk Lắk">Đắk Lắk</option>
                            <option value="Đắk Nông">Đắk Nông</option>
                            <option value="Điện Biên">Điện Biên</option>
                            <option value="Đồng Nai">Đồng Nai</option>
                            <option value="Đồng Tháp">Đồng Tháp</option>
                            <option value="Gia Lai">Gia Lai</option>
                            <option value="Hà Giang">Hà Giang</option>
                            <option value="Hà Nam">Hà Nam</option>
                            <option value="Hà Nội">Hà Nội</option>
                            <option value="Hà Tĩnh">Hà Tĩnh</option>
                            <option value="Hải Dương">Hải Dương</option>
                            <option value="Hải Phòng">Hải Phòng</option>
                            <option value="Hậu Giang">Hậu Giang</option>
                            <option value="Hòa Bình">Hòa Bình</option>
                            <option value="Hồ Chí Minh (Sài Gòn)">
                              Hồ Chí Minh (Sài Gòn)
                            </option>
                            <option value="Hưng Yên">Hưng Yên</option>
                            <option value="Khánh Hòa">Khánh Hòa</option>
                            <option value="Kiên Giang">Kiên Giang</option>
                            <option value="Kon Tum">Kon Tum</option>
                            <option value="Lai Châu">Lai Châu</option>
                            <option value="Lâm Đồng">Lâm Đồng</option>
                            <option value="Lạng Sơn">Lạng Sơn</option>
                            <option value="Lào Cai">Lào Cai</option>
                            <option value="Long An">Long An</option>
                            <option value="Nam Định">Nam Định</option>
                            <option value="Nghệ An">Nghệ An</option>
                            <option value="Ninh Bình">Ninh Bình</option>
                            <option value="Ninh Thuận">Ninh Thuận</option>
                            <option value="Phú Thọ">Phú Thọ</option>
                            <option value="Phú Yên">Phú Yên</option>
                            <option value="Quảng Bình">Quảng Bình</option>
                            <option value="Quảng Nam">Quảng Nam</option>
                            <option value="Quảng Ngãi">Quảng Ngãi</option>
                            <option value="Quảng Ninh">Quảng Ninh</option>
                            <option value="Quảng Trị">Quảng Trị</option>
                            <option value="Sóc Trăng">Sóc Trăng</option>
                            <option value="Sơn La">Sơn La</option>
                            <option value="Tây Ninh">Tây Ninh</option>
                            <option value="Thái Bình">Thái Bình</option>
                            <option value="Thái Nguyên">Thái Nguyên</option>
                            <option value="Thanh Hóa">Thanh Hóa</option>
                            <option value="Thừa Thiên Huế">
                              Thừa Thiên Huế
                            </option>
                            <option value="Tiền Giang">Tiền Giang</option>
                            <option value="Trà Vinh">Trà Vinh</option>
                            <option value="Tuyên Quang">Tuyên Quang</option>
                            <option value="Vĩnh Long">Vĩnh Long</option>
                            <option value="Vĩnh Phúc">Vĩnh Phúc</option>
                            <option value="Yên Bái">Yên Bái</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            City:<span className="text-danger">*</span>
                          </label>
                          <input
                            name="city"
                            id="city"
                            type="text"
                            className="form-control"
                            placeholder="Your city :"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />{" "}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Phone:<span className="text-danger">*</span>
                          </label>
                          <input
                            name="city"
                            id="city"
                            type="text"
                            className="form-control"
                            placeholder="Your city :"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />{" "}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Company Story :
                          </label>
                          <RichTextEditor
                            value={companyStory}
                            onChange={setCompanyStory}
                          />
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

                {/* <div className="rounded shadow p-4 mt-4">
                  <NotificationSettings />
                </div> */}
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
        <Footer top={false} />
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
    </>
  );
}
