import React from "react";

import { Route, Routes } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/style.scss";
import "./assets/css/materialdesignicons.min.css";

import Index from "./pages";
import IndexTwo from "./pages/index-two";

import JobCategories from "./pages/job-categories";
import JobGridTwo from "./pages/job-grid-two";
import JobListOne from "./pages/job-list-one";
import JobApply from "./pages/job-apply";
import JobPost from "./pages/job-post";
import Career from "./pages/career";
import JobDetailThree from "./pages/job-detail-three";

import Employers from "./pages/enterprise/employers";
import EmployerProfile from "./pages/enterprise/employer-profile";

import CandidateProfile from "./pages/jobseeker/candidate-profile";
import CandidateProfileSetting from "./pages/jobseeker/candidate-profile-setting";
import AboutUs from "./pages/aboutus";
import Services from "./pages/services";
import Pricing from "./pages/pricing";
import HelpcenterOverview from "./pages/helpcenter-overview";
import HelpcenterFaq from "./pages/helpcenter-faqs";
import HelpcenterGuides from "./pages/helpcenter-guides";
import HelpcenterSupport from "./pages/helpcenter-support";
import Blogs from "./pages/blogs";
import BlogSidebar from "./pages/blog-sidebar";
import BlogDetail from "./pages/blog-detail";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import ResetPassword from "./pages/reset-password/reset-password";

import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import ContactUs from "./pages/contactus";
import Error from "./pages/error";
import Comingsoom from "./pages/comingsoon";
import Maintenance from "./pages/maintenance";

import UpdatePassword from "./pages/update-password/update-password";
import CreatePassword from "./pages/change-password/create-password";
import ProtectedRoute from "./hook/useProtectRoute";

import CreateTemplate from "./pages/create-cv/CreateTemplates";
import TemplateContainer from "./pages/create-cv/TemplateContainer";
import TemplateDesignPinDetail from "./pages/create-cv/TemplateDesignPinDetail";
import CreateResume from "./pages/create-cv/CreateResume";
import BookmarksList from "./pages/bookmark-list";
import CVAppliedList from "./pages/job-applied-list";
import ReApply from "./pages/reapply-job";
import EnterpriseProfileSetting from "./pages/enterprise/enterprise-profile-setting";
import JobListTwo from "./pages/job-list-two";
// admin
import { productInputs, userInputs } from "./data/formSource";

import ListJobPosts from "./pages/list/ListJobPosts";
// page admin
import SingleJobPosts from "./pages/single/SingleJobPosts";
import SingleJobPostsModeration from "./pages/single/SingleJobPostsModeration";
import UserDetail from "./pages/single/UserDetail";
import AdminHome from "./pages/admin-home/AdminHome";
import ListJobSeekers from "./pages/list/ListJobSeekers";
import SingleJobSeeker from "./pages/single/SingleJobSeeker";
import SingleEnterprise from "./pages/single/SingleEnterprise";
import ListAdmins from "./pages/list/ListAdmin";
import ListEnterprise from "./pages/list/ListEnterprise";
import ListPackageService from "./pages/list/ListPackageService";
import ListTransaction from "./pages/list/ListTransaction";
import ListJobPostsModeration from "./pages/list/ListJobPostsModeration";
import ListEditPackageService from "./pages/list/ListEditPackageService";

import JobSeekersTable from "./pages/jobseeker/candidate-applied-list";
import NewJobSeeker from "./pages/newUser/NewJobSeeker";
import NewPackage from "./pages/newUser/NewPackage";
import ListBlog from "./pages/list/ListBlog";
import ListEditBlog from "./pages/list/ListEditBlog";
import NewBlog from "./pages/newUser/NewBlog";
import JobListGuest from "./pages/job-list-guest";
import ListStatistic from "./pages/list/ListStatistic";
import Recharge from "./pages/payment/recharge";
import PaymentResult from "./pages/payment/vnpay-return";
import TransactionHistory from "./pages/payment/history";
function App() {
  return (
    <>
      <Routes>
        <Route path="/Ehome" element={<Index />} />
        <Route path="/" element={<IndexTwo />} />
        <Route path="/job-categories" element={<JobCategories />} />
        <Route path="/job-grid-two" element={<JobGridTwo />} />
        <Route path="/job-list-one" element={<JobListOne />} />
        <Route path="/job-list-by-enterprise/:eid" element={<JobListTwo />} />
        <Route path="/job-list-by-enterprise" element={<JobListTwo />} />
        <Route path="/job-list-guest/:eid" element={<JobListGuest />} />
        <Route
          path="/job-apply"
          element={<ProtectedRoute element={JobApply} />}
        />
        <Route
          path="/job-apply/:jobId"
          element={<ProtectedRoute element={JobApply} />}
        />
        <Route
          path="/job-post"
          element={<ProtectedRoute element={JobPost} />}
        />
        <Route path="/career" element={<ProtectedRoute element={Career} />} />
        <Route path="/job-detail-three" element={<JobDetailThree />} />
        <Route path="/job-detail-three/:id" element={<JobDetailThree />} />
        <Route path="/employers" element={<Employers />} />
        <Route path="/employer-profile" element={<EmployerProfile />} />
        <Route path="/employer-profile/:eid" element={<EmployerProfile />} />
        <Route path="/candidate-profile" element={<CandidateProfile />} />
        <Route path="/candidate-profile/:jid" element={<CandidateProfile />} />
        <Route
          path="/candidate-profile-setting"
          element={<ProtectedRoute element={CandidateProfileSetting} />}
        />
        <Route
          path="/enterprise-profile-setting"
          element={<ProtectedRoute element={EnterpriseProfileSetting} />}
        />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/helpcenter-overview" element={<HelpcenterOverview />} />
        <Route path="/helpcenter-faqs" element={<HelpcenterFaq />} />
        <Route path="/helpcenter-guides" element={<HelpcenterGuides />} />
        <Route path="/helpcenter-support" element={<HelpcenterSupport />} />
        <Route path="/blogss" element={<Blogs />} />
        <Route path="/blog-sidebar" element={<BlogSidebar />} />
        <Route path="/blog-detail" element={<BlogDetail />} />
        <Route path="/blog-detail/:id" element={<BlogDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/candidate-applied-list" element={<JobSeekersTable />} />
        "
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="*" element={<Error />} />
        <Route path="/error" element={<Error />} />
        <Route path="/comingsoon" element={<Comingsoom />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/change-password" element={<CreatePassword />} />
        <Route path="/create-template" element={<CreateTemplate />} />
        <Route path="/template" element={<TemplateContainer />} />
        <Route
          path="/resumeDetail/:templateID"
          element={<TemplateDesignPinDetail />}
        />
        <Route path="/resume/*" element={<CreateResume />} />
        {/* new */}
        <Route path="bookmark-list" element={<BookmarksList />} />
        <Route path="cv-applied-list" element={<CVAppliedList />} />
        <Route path="reapply-job" element={<ReApply />} />
        <Route path="reapply-job/:jobId" element={<ReApply />} />
        {/* admin route */}
        {/* dashboard */}
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute element={AdminHome} />}
        />
        {/* <Route path="login" element={<Login />} /> */}
        {/* users */}
        <Route path="users">
          <Route path="job-seekers">
            <Route index element={<ListJobSeekers />} />
            <Route path="view/:id" element={<SingleJobSeeker />} />
            <Route
              path="add"
              element={
                <NewJobSeeker inputs={userInputs} title="Add New User" />
              }
            />
          </Route>
          <Route path="enterprises">
            <Route index element={<ListEnterprise />} />
            <Route path="view/:id" element={<SingleEnterprise />} />
            <Route
              path="add"
              element={
                <NewJobSeeker inputs={userInputs} title="Add New User" />
              }
            />
          </Route>
          <Route path="admins">
            <Route index element={<ListAdmins />} />
          </Route>
        </Route>
        {/* job post */}
        <Route path="jobs">
          <Route path="jobPosts">
            <Route index element={<ListJobPosts />} />
            <Route path="view/:id" element={<SingleJobPosts />} />
          </Route>
          <Route path="jobPostsModerations">
            <Route index element={<ListJobPostsModeration />} />
            <Route path="view/:id" element={<SingleJobPostsModeration />} />
          </Route>
        </Route>
        {/* The article requires moderation */}
        <Route path="jobPostsModeration">
          <Route index element={<ListJobPostsModeration />} />
          <Route path=":productId" element={<SingleJobPostsModeration />} />
        </Route>
        {/* package services */}
        <Route path="packageServices">
          <Route index element={<ListPackageService />} />
          <Route path="edit/:id" element={<ListEditPackageService />} />
          <Route
            path="add"
            element={<NewPackage inputs={userInputs} title="Add New Package" />}
          />
        </Route>
        <Route path="statistic">
          <Route index element={<ListStatistic />} />
        </Route>
        <Route path="transactions">
          <Route index element={<ListTransaction />} />
        </Route>
        {/* profile */}
        <Route path="profileAdmin">
          <Route index element={<packageServices />} />
        </Route>
        <Route>
          <Route>
            <Route path="/users">
              <Route index element={<users />} />
              <Route path="view/:jid" element={<UserDetail />} />
            </Route>
          </Route>
        </Route>
        {/* blog */}
        <Route path="blogs">
          <Route index element={<ListBlog />} />
          <Route path="edit/:id" element={<ListEditBlog />} />
          <Route
            path="add"
            element={<NewBlog inputs={userInputs} title="Add New Blog" />}
          />
        </Route>
        {/* logout */}
        <Route path="/logout">
          <Route index element={<logout />} />
        </Route>
        {/* payment */}
        <Route
          path="/recharge"
          element={<ProtectedRoute element={Recharge} />}
        />
        <Route
          path="/history"
          element={<ProtectedRoute element={TransactionHistory} />}
        />
        <Route
          path="/payment-result"
          element={<ProtectedRoute element={PaymentResult} />}
        />
      </Routes>
    </>
  );
}

export default App;
