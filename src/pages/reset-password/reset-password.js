import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import bg1 from '../../assets/images/hero/bg3.jpg'
import logo from '../../assets/images/logo2/logo-dark.png'
import api from '../../api/http'
export default function ResetPassword() {
    const navigate = useNavigate();
    const forgotPasswordMutation = useMutation({
        mutationFn: (body) => {
            return api.post("reset-password", body);
        },
    });
    // doc phan event nhap vao
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
        };

        onfinish(data);
    };
    const onfinish = (body) => {
        forgotPasswordMutation.mutate(body, {
            onSuccess(data) {
                navigate('/login');
                toast.success("Email is sent successfully. Please check your mail")
                console.log({ message: "check mail" })
            },
            onError() {
                toast.error("Email is sent failed")
            }
        })
    }

    return (
        <section className="bg-home d-flex align-items-center" style={{ backgroundImage: `url(${bg1})`, backgroundPosition: 'center' }}>
            <div className="bg-overlay bg-linear-gradient-2"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-5 col-12">
                        <div className="p-4 bg-white rounded shadow-md mx-auto w-100" style={{ maxWidth: '400px' }}>
                            <form onSubmit={handleSubmit}>
                                <Link to="/"><img src={logo} className="mb-4 d-block mx-auto" alt="" /></Link>
                                <h6 className="mb-2 text-uppercase fw-semibold">Reset your password</h6>

                                <p className="text-muted">Please enter your email address. You will receive a link to create a new password via email.</p>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Your Email</label>
                                    <input name="email" id="email" type="email" className="form-control" placeholder="example@gmail.com" />
                                </div>

                                <button className="btn btn-primary w-100" type="submit">Send</button>
                                <div className="col-12 text-center mt-3">
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}