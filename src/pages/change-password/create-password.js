import React from "react";

import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import bg1 from '../../assets/images/hero/bg3.jpg'
import logo from '../../assets/images/logo-dark.png'
import api from '../../api/http'

export default function CreatePassword(){

    const navigate = useNavigate();
    
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const changePasswordMutation = useMutation({
        mutationFn: (body) => {
            return api.patch("change-password", body);
        },
    });
    const ChangePassword = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newPassword = formData.get("newPassword");
        const confirmPassword = formData.get("confirmPassword");

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        const body = { newPassword, token };
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
    return(
        <section className="bg-home d-flex align-items-center" style={{backgroundImage:`url(${bg1})`, backgroundPosition:'center'}}>
            <div className="bg-overlay bg-linear-gradient-2"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-5 col-12">
                        <div className="p-4 bg-white rounded shadow-md mx-auto w-100" style={{maxWidth:'400px'}}>
                            <form onSubmit={ChangePassword}>
                                <img src={logo} className="mb-4 d-block mx-auto" alt=""/>
                                <h6 className="mb-3 text-uppercase fw-semibold">Change Your Password</h6>
                            
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Your New Password</label>
                                    <input name="newPassword" id="password" type="password" className="form-control" placeholder="new password"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold" htmlFor="loginpass">Confirn Password</label>
                                    <input  name="confirmPassword" type="password" className="form-control" id="loginpass" placeholder="Password"/>
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