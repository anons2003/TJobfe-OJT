import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import 'react-toastify/dist/ReactToastify.css';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import bg1 from '../../assets/images/hero/bg3.jpg'
import logo from '../../assets/images/logo2/logo-dark.png'
import api from '../../api/http'
import '../../assets/css/eyes.css'
export default function Login() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    //hien password
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const loginMutation = useMutation({
        mutationFn: (formData) => {
            return api.post('login', formData);
        },
    });
    const reverifyMutation = useMutation({
        mutationFn: (formData) => {
            return api.post("reverify", formData);
        },
    });


    // doc phan event nhap vao
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        if (!email || !password) {
            toast.error('Email and Password cannot be blank');
            return;
        }

        const data = {
            email: email,
            password: password,
        };

        onfinish(data);
    };
    const onfinish = (body) => {
        loginMutation.mutate(body, {
            onError: (error) => {
                const errorMessage = error.response ? error.response.data.message : error.message;
                if (error.response && error.response.data.message === "not_verify_yet") {
                    reverifyMutation.mutate(
                        { email: body.email },
                        {
                            onSuccess: () => {
                                toast.success('Please check your email to verify your account!'); // Hiển thị thông báo
                                navigate('/login');
                            },
                        }
                    );
                } else {
                    // console.error({ message: error.response ? error.response.data.message : error.message });
                    toast.error(errorMessage); // Hiển thị thông báo lỗi
                    console.error({ message: errorMessage });
                }
            },
        });
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
                                <h6 className="mb-3 text-uppercase fw-semibold">Please sign in</h6>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Your Email</label>
                                    <input name="email" id="email" type="email" className="form-control" placeholder="example@gmail.com" />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold" htmlFor="loginpass">Password</label>
                                    <div className="input-group">
                                        <input type={showPassword ? 'text' : 'password'} className="form-control" id="loginpass" name="password" placeholder="Password" />
                                        <span className="input-group-append" onClick={togglePasswordVisibility}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                            <label className="form-label form-check-label text-muted" htmlFor="flexCheckDefault">Remember me</label>
                                        </div>
                                    </div>
                                    <span className="forgot-pass text-muted small mb-0"><Link to="/reset-password" className="text-muted">Forgot password ?</Link></span>
                                </div>

                                <button className="btn btn-primary w-100" type="submit">Sign in</button>

                                <div className="col-12 text-center mt-3">
                                    <span><span className="text-muted me-2 small">Don't have an account ?</span> <Link to="/signup" className="text-dark fw-semibold small">Sign Up</Link></span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
