import React from "react";
import { Link } from "react-router-dom";

import bg1 from "../assets/images/hero/bg.jpg"

import Navbar from "../components/navbar";
import About from "../components/aboutUs"
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";

import { servicesData, teamData } from "../data/data";
import {FiFacebook, FiInstagram, FiTwitter, FiHelpCircle} from "../assets/icons/vander"

export default function AboutUs(){
    return(
        <>
        <Navbar navClass="defaultscroll sticky" navLight={true}/>
        <section className="bg-half-170 d-table w-100" style={{backgroundImage:`url(${bg1})`, backgroundPosition:'top'}}>
            <div className="bg-overlay bg-gradient-overlay"></div>
            <div className="container">
                <div className="row mt-5 justify-content-center">
                    <div className="col-12">
                        <div className="title-heading text-center">
                            <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">Về Chúng Tôi</h5>
                        </div>
                    </div>
                </div>

                <div className="position-middle-bottom">
                    <nav aria-label="breadcrumb" className="d-block">
                        <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                            <li className="breadcrumb-item"><Link to="/">TopJob</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Về Chúng Tôi</li>
                        </ul>
                    </nav>
                </div>
            </div>
        </section>
        <div className="position-relative">
            <div className="shape overflow-hidden text-white">
                <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                </svg>
            </div>
        </div>

        <section className="section">
            <About containerClass="container"/>

            <div className="container mt-100 mt-60">
                <div className="row justify-content-center mb-4 pb-2">
                    <div className="col-12">
                        <div className="section-title text-center">
                            <h4 className="title mb-3">Tại sao bạn sẽ yêu thích TopJob</h4>
                            <p className="text-muted para-desc mx-auto mb-0">Tìm kiếm tất cả các vị trí mở trên web. Nhận ước tính lương cá nhân của bạn. Đọc đánh giá về các công ty.</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {servicesData.map((item,index)=>{
                        let Icon = item.icon
                        return(
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mt-4 pt-2" key={index}>
                            <div className="position-relative features text-center p-4 rounded shadow bg-white">
                                <div className="feature-icon bg-soft-primary rounded shadow mx-auto position-relative overflow-hidden d-flex justify-content-center align-items-center">
                                    <Icon className="fea icon-ex-md"/>
                                </div>
        
                                <div className="mt-4">
                                    <Link to="" className="title h5 text-dark">{item.title}</Link>
                                    <p className="text-muted mt-3 mb-0">{item.desc}</p>
                                    {/* <div className="mt-3">
                                        <Link to="" className="btn btn-link primary text-dark">Đọc Thêm <i className="mdi mdi-arrow-right"></i></Link>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
            </div>

            <div className="container mt-100 mt-60">
                <div className="row justify-content-center">
                    <div className="col">
                        <div className="section-title text-center mb-4 pb-2">
                            <h4 className="title mb-3">Đội Ngũ Của Chúng Tôi</h4>
                            <p className="text-muted para-desc mb-0 mx-auto">Tìm kiếm tất cả các vị trí mở trên web. Nhận ước tính lương cá nhân của bạn. Đọc đánh giá về các công ty.</p>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mt-0">
                    {teamData.map((item,index)=>{
                        return(
                        <div className="col-lg-3 col-md-4 col-12" key={index}>
                            <div className="card team team-primary text-center">
                                <div className="card-img team-image d-inline-block mx-auto rounded-pill avatar avatar-ex-large overflow-hidden">
                                    <img src={item.image} className="img-fluid" alt=""/>
                                    <div className="card-overlay avatar avatar-ex-large rounded-pill"></div>
    
                                    <ul className="list-unstyled team-social mb-0">
                                        <li className="list-inline-item"><Link to="#" className="btn btn-sm btn-pills btn-icon"><FiFacebook className="icons fea-social"/></Link></li>
                                        <li className="list-inline-item"><Link to="#" className="btn btn-sm btn-pills btn-icon"><FiInstagram className="icons fea-social"/></Link></li>
                                        <li className="list-inline-item"><Link to="#" className="btn btn-sm btn-pills btn-icon"><FiTwitter className="icons fea-social"/></Link></li>
                                    </ul>
                                </div>
    
                                <div className="content mt-3">
                                    <Link to="#" className="text-dark h5 mb-0 title">{item.name}</Link>
                                    <h6 className="text-muted mb-0 fw-normal">{item.title}</h6>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
            </div>

            <div className="container mt-100 mt-60">
                <div className="row justify-content-center">
                    <div className="col">
                        <div className="section-title text-center mb-4 pb-2">
                            <h4 className="title mb-3">Câu Hỏi & Trả Lời</h4>
                            <p className="text-muted para-desc mb-0 mx-auto">Tìm kiếm tất cả các vị trí mở trên web. Nhận ước tính lương cá nhân của bạn. Đọc đánh giá về các công ty.</p>
                        </div>
                    </div>
                </div>

                <div className="row mt-4 pt-2">
                    <div className="col-md-6 col-12">
                        <div className="d-flex">
                            <FiHelpCircle className="fea icon-ex-md text-primary me-2 mt-1"/>
                            <div className="flex-1">
                                <h5 className="mt-0">TobJob của chúng tôi hoạt động như thế nào?</h5>
                                <p className="answer text-muted mb-0">Do việc sử dụng phổ biến văn bản làm văn bản mẫu cho bố cục, tính không đọc được rất quan trọng: nhận thức của con người được điều chỉnh để nhận ra các mẫu và sự lặp lại nhất định trong văn bản.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-6 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
                        <div className="d-flex">
                            <FiHelpCircle className="fea icon-ex-md text-primary me-2 mt-1"/>
                            <div className="flex-1">
                                <h5 className="mt-0">Quá trình chính để mở tài khoản là gì?</h5>
                                <p className="answer text-muted mb-0">Hãy nhập nhưng phần điền cần thiết là bạn có thể tạo 1 tài khoản thành công.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-6 col-12 mt-4 pt-2">
                        <div className="d-flex">
                            <FiHelpCircle className="fea icon-ex-md text-primary me-2 mt-1"/>
                            <div className="flex-1">
                                <h5 className="mt-0">Làm thế nào để nhập dữ liệu không giới hạn?</h5>
                                <p className="answer text-muted mb-0">Bạn có thể đăng cái ảnh đê làm tăng sự phong phú cho profile của bạn.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-6 col-12 mt-4 pt-2">
                        <div className="d-flex">
                            <FiHelpCircle className="fea icon-ex-md text-primary me-2 mt-1"/>
                            <div className="flex-1">
                                <h5 className="mt-0">TopJob có an toàn khi sử dụng với tài khoản của tôi không?</h5>
                                <p className="answer text-muted mb-0">Chúng tôi cam kết đảm bảo an toàn tài khoản của bạn khi sử dụng công nghệ để đảm bảo tài khoản của bạn.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-md-5 pt-md-3 mt-4 pt-2 justify-content-center">
                    <div className="col-12 text-center">
                        <div className="section-title">
                            <h4 className="title mb-4">Có Câu Hỏi? Liên hệ với chúng tôi!</h4>
                            <p className="text-muted para-desc mx-auto">Bắt đầu làm việc với <span className="text-primary fw-bold">TopJob</span> có thể cung cấp mọi thứ bạn cần để tạo ra công việc, thu hút lưu lượng truy cập, kết nối nhiều người.</p>
                            <Link to="/contactus" className="btn btn-primary mt-3"><i className="uil uil-phone"></i> Liên hệ chúng tôi</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Footer/>
        <ScrollTop/>
        </>

    )
}
