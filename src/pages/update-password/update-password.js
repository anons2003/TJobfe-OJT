import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import bg1 from '../../assets/images/hero/bg3.jpg'
import logo from '../../assets/images/logo2/logo-dark.png'
import '../../assets/css/eyes.css'
import api from '../../api/http'
import useProtectRoute from '../../hook/useProtectRoute'


export default function UpdatePassword() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    useProtectRoute();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const changePasswordMutation = useMutation({
        mutationFn: (body) => {
            return api.patch("update-password", body);
        },
    });

    const UpdatePassword = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const oldPassword = formData.get("oldPassword");
        const newPassword = formData.get("newPassword");
        const confirmPassword = formData.get("confirmPassword");

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        const body = { oldPassword, newPassword, token };
        changePasswordMutation.mutate(body, {
            onSuccess() {
                navigate("/login")
                toast.success("Reset password successfully");
            },
            onError() {
                toast.error("Reset password failed, Try again later");
            },
        });
    };

    return (
        <section className="bg-home d-flex align-items-center" style={{ backgroundImage: `url(${bg1})`, backgroundPosition: 'center' }}>
            <div className="bg-overlay bg-linear-gradient-2"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-5 col-12">
                        <div className="p-4 bg-white rounded shadow-md mx-auto w-100" style={{ maxWidth: '400px' }}>
                            <form onSubmit={UpdatePassword}>
                                <img src={logo} className="mb-4 d-block mx-auto" alt="" />
                                <h6 className="mb-3 text-uppercase fw-semibold">Update your Password</h6>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Your old password</label>
                                    <input name="oldPassword" type="password" className="form-control" placeholder="old password" required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Your new Password</label>
                                    <div className="input-group">
                                        <input
                                            name="newPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            placeholder="new password"
                                            required
                                        />
                                        <span className="input-group-append" onClick={togglePasswordVisibility}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Confirm new Password</label>
                                    <div className="input-group">
                                        <input
                                            name="confirmPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            placeholder="confirm password"
                                            required
                                        />
                                        <span className="input-group-append" onClick={togglePasswordVisibility}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </div>

                                <button className="btn btn-primary w-100" type="submit">Change Password</button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
