import React, { useEffect, useRef, useState } from "react";
import api from "../../../api/http";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { TemplateOne } from '../../../assets/index'
import useJobSeekerInfo from '../../../hook/useJobSeekerInfo';
import getTemplateDetailEditByUser from '../../../hook/useTemplateByUser';
import { initialFormData, initialExperiences, initialSkills, initialEducation } from "./supports/data";
import {
  FaTrash,
  FaPenToSquare,
  FaPencil,
  FaPlus,
} from "react-icons/fa6";
import { BiSolidBookmarks } from "react-icons/bi";
import {
  BsFiletypePdf,
  BsFiletypePng,
  BsFiletypeJpg,
  BsFiletypeSvg,
} from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { FadeInOutWIthOpacity, opacityINOut } from "../../../animation";
import * as htmlToImage from "html-to-image";
import { jsPDF } from 'jspdf';
import MainSpinner from "../../MainSpinner";
import NavbarDark from "../../navbarDark"

const Template1 = () => {

  const { pathname } = useLocation();
  const location = useLocation();
  const templateName = pathname?.split("/")?.slice(-1)[0];
  const searchParams = new URLSearchParams(location.search);
  const loadedTemplateId = searchParams.get("templateId");
  // console.log(pathname, templateName, loadedTemplateId);
  const [isEdit, setIsEdit] = useState(false);
  const { data: jobseekerData } = useJobSeekerInfo();
  const jobseeker = jobseekerData?.data;
  const resumeRef = useRef(null);
  //dung de an cai FaTrash khi luu
  const [hideTrash, setHideTrash] = useState(false);
  // console.log('Jobseeker uid:', jobseeker?.jid);
  // console.log('Template Name:', templateName);
  // console.log('Loaded Template ID:', loadedTemplateId);

  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    imageURL: null,
  });

  const {
    data: resumeData,
    isLoading: resume_isLoading,
    isError: resume_isError,
    refetch: refetch_resumeData,
  } = useQuery({
    queryKey: ["templateEditedByUser", `${templateName}-${jobseeker?.jid}`], // Định danh queryKey
    queryFn: () => getTemplateDetailEditByUser(jobseeker?.jid, `${templateName}`), // Hàm truy vấn
    refetchOnWindowFocus: false,
    enabled: !!jobseeker?.jid && !!templateName,// Tắt tự động refetch khi cửa sổ được focus
  });

  const [formData, setFormData] = useState(initialFormData);

  const [experiences, setExperiences] = useState(initialExperiences);

  const [skills, setSkills] = useState(initialSkills);

  const [education, setEducation] = useState(initialEducation);


  useEffect(() => {
    if (resumeData) {
      const {
        refererName,
        refererRole,
        fullname,
        email,
        address,
        mobile,
        personalDescription,
        professionalTitle,
        website,
        experiences,
        skills,
        education,
        userProfilePic
      } = resumeData;

      setFormData((prevFormData) => ({
        ...prevFormData,
        refererName,
        refererRole,
        fullname,
        email,
        address,
        mobile,
        personalDescription,
        professionalTitle,
        website,
      }));

      setExperiences(experiences && experiences.length > 0 ? experiences : initialExperiences);
      setSkills(skills && skills.length > 0 ? skills : initialSkills);
      setEducation(education && education.length > 0 ? education : initialEducation);

      if (userProfilePic) {
        setImageAsset((prevAsset) => ({
          ...prevAsset,
          imageURL: userProfilePic,
        }));
      }
    }
  }, [resumeData]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleEditable = () => {
    setIsEdit(!isEdit);
    const inputs = document.querySelectorAll("input");
    const textarea = document.querySelectorAll("textarea");

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].readOnly = !inputs[i].readOnly;
    }

    for (let i = 0; i < textarea.length; i++) {
      textarea[i].readOnly = !textarea[i].readOnly;
    }
  };


  // image upload to the cloud
  const handleFileSelect = async (event) => {
    setImageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: true }));
    // console.log(event.target.files[0]);
    const file = event.target.files[0];
    if (file && isAllowed(file)) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const dataURL = event.target.result;
        console.log("Data URL:", dataURL);

        // You can now use the dataURL as needed, e.g., to display an image.
        setImageAsset((prevAsset) => ({
          ...prevAsset,
          imageURL: dataURL,
        }));
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

  // delete an image
  const deleteImageObject = () => {
    setImageAsset((prevAsset) => ({
      ...prevAsset,
      imageURL: null,
    }));
  };

  // uploader finshed
  const handleExpChange = (index, e) => {
    const { name, value } = e.target;
    // Create a copy of the workExperiences array
    const updatedExperiences = [...experiences];
    // Update the specific field for the experience at the given index
    updatedExperiences[index][name] = value;
    // Update the state with the modified array
    setExperiences(updatedExperiences);
  };

  const removeExperience = (index) => {
    // Create a copy of the workExperiences array and remove the experience at the given index
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    // Update the state with the modified array
    setExperiences(updatedExperiences);
  };

  const addExperience = () => {
    // Create a copy of the workExperiences array and add a new experience
    const updatedExperiences = [
      ...experiences,
      {
        year: "2012 - 2014",
        title: "Job Position Here",
        companyAndLocation: "Company Name / Location here",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
      },
    ];
    // Update the state with the modified array
    setExperiences(updatedExperiences);
  };

  const handleSkillsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSkills = [...skills];
    updatedSkills[index][name] = value;
    setSkills(updatedSkills);
  };

  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const addSkill = () => {
    const updatedSkills = [
      ...skills,
      {
        title: "skill1",
        percentage: "75",
      },
    ];
    setSkills(updatedSkills);
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEdu = [...education];
    updatedEdu[index][name] = value;
    setEducation(updatedEdu);
  };

  const removeEducation = (index) => {
    const updatedEdu = [...education];
    updatedEdu.splice(index, 1);
    setEducation(updatedEdu);
  };

  const addEducation = () => {
    const updatedEdu = [
      ...education,
      {
        major: "ENTER YOUR MAJOR",
        university: "Name of your university / college 2005-2009",
      },
    ];
    setEducation(updatedEdu);
  };


  const saveFormData = async () => {
    const timeStamp = new Date().toISOString();
    const resume_id = `${templateName}-${jobseeker?.jid}`;
    const imageURL = await getImage();


    const formDataToSend = {
      _id: loadedTemplateId,
      resume_id,
      fullname: formData.fullname,
      professionalTitle: formData.professionalTitle,
      personalDescription: formData.personalDescription,
      refererName: formData.refererName,
      refererRole: formData.refererRole,
      mobile: formData.mobile,
      email: formData.email,
      website: formData.website,
      address: formData.address,
      education,
      experiences,
      skills,
      timeStamp,
      userProfilePic: imageAsset.imageURL,
      imageURL,
    };

    console.log('formDataToSend:', formDataToSend);

    try {
      const response = await api.patch(`/resumes/user/${jobseeker?.jid}/resume/${templateName}`, formDataToSend);
      console.log('Response:', response.data);
      toast.success(`Data Saved`);
      refetch_resumeData();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error('API error:', error.response?.data);
    }
  };

  const getImage = async () => {
    const element = resumeRef.current;
    element.onload = async () => {
      // Call the image capture code here
    };
    element.onerror = (error) => {
      console.error("Image loading error:", error);
    };
    if (!element) {
      console.error("Unable to capture content. The DOM element is null.");
      return;
    }
    try {
      const dataUrl = await htmlToImage.toJpeg(element, { quality: 0.6 });
      return dataUrl;
    } catch (error) {
      console.error("Oops, something went wrong!", error.message);
      return null; // Return a default value or handle the error appropriately
    }
  };

  //generate online
  const generatePDF = async () => {
    setHideTrash(true);
    const pdf = new jsPDF();
    const canvas = await htmlToImage.toCanvas(resumeRef.current);
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save('document.pdf');
  };

  const generateImage = async () => {
    setHideTrash(true);
    const canvas = await htmlToImage.toCanvas(resumeRef.current);
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'image.png';
    link.click();
  };

  const generatePng = generateImage;

  const generateSvg = async () => {
    setHideTrash(true);
    const svgData = await htmlToImage.toSvg(resumeRef.current);
    const link = document.createElement('a');
    link.href = 'data:image/svg+xml;base64,' + btoa(svgData);
    link.download = 'image.svg';
    link.click();
  };


  if (resume_isLoading) return <MainSpinner />;

  if (resume_isError) {
    return (
      <div className='tw-w-full tw-h-[60vh] tw-flex tw-flex-col tw-items-center tw-justify-center'>
        <p className='tw-text-lg tw-text-txtPrimary tw-font-semibold'>Error when fetching data....Please try again</p>
      </div>
    );
  }
  return (
    <> <NavbarDark />
      <section >
        <div className="tw-w-full tw-flex tw-flex-col tw-items-center tw-justify-start tw-gap-4" style={{ marginTop: '60px' }} >
          {/* bread crump */}
          <div className="tw-w-full tw-flex tw-items-center tw-gap-2 tw-px-4">
            <div className="tw-w-full lg:tw-w-[1200px] tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-px-6 lg:tw-px-32">
              <div className="tw-col-span-12 tw-px-4 tw-py-6">
                <div className="tw-flex tw-items-center tw-justify-end tw-w-full tw-gap-12 tw-mb-4">

                  <div
                    className="tw-flex tw-items-center tw-justify-center tw-gap-1 tw-px-3 tw-py-1 tw-rounded-md tw-bg-gray-200 tw-cursor-pointer"
                    onClick={toggleEditable}
                  >
                    {isEdit ? (
                      <FaPenToSquare className="tw-text-sm tw-text-txtPrimary" />
                    ) : (
                      <FaPencil className="tw-text-sm tw-text-txtPrimary" />
                    )}
                    <p className="tw-text-sm tw-text-txtPrimary">Edit</p>
                  </div>

                  <div
                    className="tw-flex tw-items-center tw-justify-center tw-gap-1 tw-px-3 tw-py-1 tw-rounded-md tw-bg-gray-200 tw-cursor-pointer"
                    onClick={saveFormData}
                  >
                    <BiSolidBookmarks className="tw-text-sm tw-text-txtPrimary" />
                    <p className="tw-text-sm tw-text-txtPrimary">Save</p>
                  </div>

                  <div className="tw-flex tw-items-center tw-justify-center tw-gap-2">
                    <p className="tw-text-sm tw-text-txtPrimary">Download : </p>
                    <BsFiletypePdf
                      className="tw-text-2xl tw-text-txtPrimary tw-cursor-pointer"
                      onClick={generatePDF}
                    />
                    <BsFiletypePng
                      onClick={generatePng}
                      className="tw-text-2xl tw-text-txtPrimary tw-cursor-pointer"
                    />
                    <BsFiletypeJpg
                      className="tw-text-2xl tw-text-txtPrimary tw-cursor-pointer"
                      onClick={generateImage}
                    />
                    <BsFiletypeSvg
                      onClick={generateSvg}
                      className="tw-text-2xl tw-text-txtPrimary tw-cursor-pointer"
                    />
                  </div>
                </div>

                <div className="tw-w-full tw-h-auto tw-grid tw-grid-cols-12 tw-border-4 tw-border-sky-500" ref={resumeRef}>

                  <div className="tw-col-span-4 tw-bg-black tw-flex tw-flex-col tw-items-center tw-justify-start">
                    <div className="tw-w-full tw-h-80 tw-bg-gray-300 tw-flex tw-items-center tw-justify-center">
                      {!imageAsset.imageURL ? (
                        <React.Fragment>
                          <label className="tw-w-full tw-cursor-pointer tw-h-full">
                            <div className="tw-w-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full">
                              <div className="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-cursor-pointer">
                                <img
                                  src={TemplateOne}
                                  className="tw-w-full tw-h-80 tw-object-cover"
                                  alt=""
                                />
                              </div>
                            </div>

                            {isEdit && (
                              <input
                                type="file"
                                className="tw-w-0 tw-h-0"
                                accept=".jpeg,.jpg,.png"
                                onChange={handleFileSelect}
                              />
                            )}
                          </label>
                        </React.Fragment>
                      ) : (
                        <div className="tw-relative tw-w-full tw-h-full tw-overflow-hidden tw-rounded-md">
                          <img
                            src={imageAsset.imageURL}
                            alt="uploaded img"
                            className="tw-w-full tw-h-full tw-object-cover"
                            loading="lazy"
                          />

                          {isEdit && !hideTrash && (
                            <div
                              className="tw-absolute tw-top-4 tw-right-4 tw-w-8 tw-h-8 tw-rounded-md tw-flex tw-items-center tw-justify-center tw-bg-red-500 tw-cursor-pointer"
                              onClick={deleteImageObject}
                            >
                              <FaTrash className="tw-text-sm tw-text-white" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="tw-w-full tw-flex tw-flex-col tw-items-center tw-justify-start tw-pl-8 tw-mt-4 tw-gap-6">
                      <div className="tw-w-full">
                        <p className="tw-uppercase tw-text-lg tw-font-semibold tw-text-gray-100">
                          Education
                        </p>
                        <div className="tw-w-full tw-h-[2px] tw-bg-yellow-400 tw-mt-2"></div>
                        <AnimatePresence>
                          {education &&
                            education?.map((edu, i) => (
                              <motion.div
                                key={i}
                                {...opacityINOut(i)}
                                className="tw-w-full tw-pl-4 tw-mt-3 tw-relative"
                              >
                                <input
                                  type="text"
                                  readOnly={true}
                                  name="major"
                                  value={edu.major}
                                  onChange={(e) => handleEducationChange(i, e)}
                                  className={`tw-bg-transparent tw-outline-none tw-border-none tw-text-sm tw-font-semibold tw-uppercase  tw-text-gray-100  ${isEdit && "tw-text-yellow-400 tw-w-full"}`}
                                />

                                <textarea
                                  readOnly={true}
                                  className={`tw-text-xs tw-text-gray-200 tw-mt-2  tw-w-full  tw-outline-none tw-border-none ${isEdit ? "tw-bg-[#1c1c1c]" : "tw-bg-transparent"}`}
                                  name="university"
                                  value={edu.university}
                                  onChange={(e) => handleEducationChange(i, e)}
                                  rows="2"
                                  style={{
                                    maxHeight: "auto",
                                    minHeight: "40px",
                                    resize: "none",
                                  }}
                                />
                                <AnimatePresence>
                                  {isEdit && (
                                    <motion.div
                                      {...FadeInOutWIthOpacity}
                                      onClick={() => removeEducation(i)}
                                      className="tw-cursor-pointer tw-absolute tw-right-2 tw-top-0"
                                    >
                                      <FaTrash className="tw-text-sm tw-text-gray-100" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            ))}
                        </AnimatePresence>
                      </div>

                      <AnimatePresence>
                        {isEdit && (
                          <motion.div
                            {...FadeInOutWIthOpacity}
                            onClick={addEducation}
                            className="tw-cursor-pointer"
                          >
                            <FaPlus className="tw-text-base tw-text-gray-100" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* reference */}
                      <div className="tw-w-full">
                        <p className="tw-uppercase tw-text-lg tw-font-semibold tw-text-gray-100">
                          Reference
                        </p>
                        <div className="tw-w-full tw-h-[2px] tw-bg-yellow-400 tw-mt-2"></div>
                        <div className="tw-w-full tw-pl-4 tw-mt-3">
                          <input
                            value={formData.refererName}
                            onChange={handleChange}
                            name="refererName"
                            type="text"
                            readOnly={!isEdit}
                            className={`tw-bg-transparent tw-outline-none tw-border-none tw-text-base tw-tracking-widest tw-capitalize tw-text-gray-100 tw-w-full ${isEdit && "tw-bg-[#1c1c1c]"}`}
                          />

                          <input
                            value={formData.refererRole}
                            onChange={handleChange}
                            name="refererRole"
                            type="text"
                            readOnly={!isEdit}
                            className={`tw-bg-transparent tw-outline-none tw-border-none tw-text-xs tw-capitalize tw-text-gray-300 tw-w-full ${isEdit && "tw-bg-[#1c1c1c]"}`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="tw-w-full tw-flex tw-flex-col tw-items-start tw-justify-start tw-mt-6 tw-gap-6">
                      <div className="tw-w-full tw-grid tw-grid-cols-12">
                        <div className="tw-col-span-3 tw-w-full tw-h-6 tw-bg-yellow-400"></div>
                        <div className="tw-col-span-9">
                          <div className="tw-w-full tw-h-6 tw-bg-[rgba(45,45,45,0.6)] tw-px-3 tw-flex tw-items-center">
                            <p className="tw-text-sm tw-font-semibold tw-text-gray-200">
                              Phone
                            </p>
                          </div>
                          <input
                            value={formData.mobile}
                            onChange={handleChange}
                            name="mobile"
                            type="text"
                            readOnly={true}
                            className={`tw-bg-transparent tw-outline-none tw-border-none tw-text-xs tw-px-3 tw-mt-2 tw-text-gray-200 tw-w-full ${isEdit && "tw-bg-[#1c1c1c]"}`}
                          />
                        </div>
                      </div>

                      {/* email */}
                      <div className="tw-w-full tw-grid tw-grid-cols-12">
                        <div className="tw-col-span-3 tw-w-full tw-h-6 tw-bg-yellow-400"></div>
                        <div className="tw-col-span-9">
                          <div className="tw-w-full tw-h-6 tw-bg-[rgba(45,45,45,0.6)] tw-px-3 tw-flex tw-items-center">
                            <p className="tw-text-sm tw-font-semibold tw-text-gray-200">
                              Email
                            </p>
                          </div>
                          <input
                            value={formData.email}
                            onChange={handleChange}
                            name="email"
                            type="text"
                            readOnly={true}
                            className={`tw-bg-transparent tw-outline-none tw-border-none tw-text-xs tw-px-3 tw-mt-2 tw-text-gray-200 tw-w-full ${isEdit && "tw-bg-[#1c1c1c]"}`}
                          />
                        </div>
                      </div>

                      {/* website */}
                      <div className="tw-w-full tw-grid tw-grid-cols-12">
                        <div className="tw-col-span-3 tw-w-full tw-h-6 tw-bg-yellow-400"></div>
                        <div className="tw-col-span-9">
                          <div className="tw-w-full tw-h-6 tw-bg-[rgba(45,45,45,0.6)] tw-px-3 tw-flex tw-items-center">
                            <p className="tw-text-sm tw-font-semibold tw-text-gray-200">
                              Website
                            </p>
                          </div>

                          <input
                            value={formData.website}
                            onChange={handleChange}
                            name="website"
                            type="text"
                            readOnly={true}
                            className={`tw-bg-transparent tw-outline-none tw-border-none tw-text-xs tw-px-3 tw-mt-2 tw-text-gray-200 tw-w-full ${isEdit && "tw-bg-[#1c1c1c]"}`}
                          />
                        </div>
                      </div>

                      {/* address */}
                      <div className="tw-w-full tw-grid tw-grid-cols-12">
                        <div className="tw-col-span-3 tw-w-full tw-h-6 tw-bg-yellow-400"></div>
                        <div className="tw-col-span-9">
                          <div className="tw-w-full tw-h-6 tw-bg-[rgba(45,45,45,0.6)] tw-px-3 tw-flex tw-items-center">
                            <p className="tw-text-sm tw-font-semibold tw-text-gray-200">
                              Address
                            </p>
                          </div>

                          <textarea
                            readOnly={true}
                            className={`tw-text-xs tw-text-gray-200 tw-mt-2 tw-px-3  tw-w-full  tw-outline-none tw-border-none ${isEdit ? "tw-bg-[#1c1c1c]" : "tw-bg-transparent"}`}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="2"
                            style={{
                              maxHeight: "auto",
                              minHeight: "40px",
                              resize: "none",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tw-col-span-8 tw-flex tw-flex-col tw-items-center tw-justify-start tw-py-6 tw-bg-white">
                    <div className="tw-w-full tw-py-6"></div>
                    {/* title */}
                    <div className="tw-w-full tw-px-8 tw-py-6 tw-bg-yellow-500">
                      <div className="tw-flex tw-items-center tw-justify-start">
                        <input
                          type="text"
                          readOnly={true}
                          name="fullname"
                          value={formData.fullname}
                          onChange={handleChange}
                          className={`tw-bg-transparent tw-outline-none tw-border-none tw-text-3xl tw-font-sans tw-uppercase tw-tracking-wider tw-text-txtDark tw-font-extrabold ${isEdit && "tw-text-white tw-w-full"
                            }`}
                        />
                      </div>

                      <input
                        value={formData.professionalTitle}
                        onChange={handleChange}
                        name="professionalTitle"
                        type="text"
                        readOnly={true}
                        className={`tw-bg-transparent tw-outline-none tw-border-none tw-text-xl tw-tracking-widest tw-uppercase tw-text-txtPrimary tw-w-full ${isEdit && "tw-text-white"
                          }`}
                      />
                    </div>

                    {/* about me */}
                    <div className="tw-w-full tw-px-8 tw-py-6 tw-flex tw-flex-col tw-items-start tw-justify-start tw-gap-6">
                      <div className="tw-w-full">
                        <p className="tw-uppercase tw-text-xl tw-tracking-wider">About Me</p>
                        <div className="tw-w-full tw-h-1 tw-bg-txtDark tw-my-3"></div>
                        <textarea
                          readOnly={true}
                          className={`tw-text-base tw-text-txtPrimary tw-tracking-wider tw-w-full tw-outline-none tw-border-none ${isEdit ? "tw-bg-gray-200" : "tw-bg-transparent"
                            }`}
                          name="personalDescription"
                          value={formData.personalDescription}
                          onChange={handleChange}
                          rows="4"
                          style={{
                            minHeight: "100px",
                            width: "100%",
                            height: "100px",
                            resize: "none",
                          }}
                        />
                      </div>

                      {/* experience */}
                      <div className="tw-w-full">
                        <p className="tw-uppercase tw-text-xl tw-tracking-wider">
                          Work Experience
                        </p>
                        <div className="tw-w-full tw-h-1 tw-bg-txtDark tw-my-3"></div>
                        <div className="tw-w-full tw-flex tw-flex-col tw-items-center tw-justify-start tw-gap-4">
                          <AnimatePresence>
                            {experiences &&
                              experiences?.map((exp, i) => (
                                <motion.div
                                  {...opacityINOut(i)}
                                  className="tw-w-full tw-grid tw-grid-cols-12"
                                  key={i}
                                >
                                  <div className="tw-col-span-4">
                                    <input
                                      value={exp.year}
                                      onChange={(e) => handleExpChange(i, e)}
                                      name="year"
                                      type="text"
                                      readOnly={true}
                                      className={`tw-outline-none tw-border-none tw-text-base tw-tracking-eide tw-uppercase tw-text-txtDark tw-w-full ${isEdit ? "tw-bg-gray-200" : "tw-bg-transparent"
                                        }`}
                                    />
                                  </div>
                                  <div className="tw-col-span-8 tw-relative">
                                    <AnimatePresence>
                                      {isEdit && (
                                        <motion.div
                                          {...FadeInOutWIthOpacity}
                                          onClick={() => removeExperience(i)}
                                          className="tw-cursor-pointer tw-absolute tw-right-0 tw-top-2"
                                        >
                                          <FaTrash className="tw-text-base tw-text-txtPrimary" />
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                    <input
                                      value={exp.title}
                                      onChange={(e) => handleExpChange(i, e)}
                                      name="title"
                                      type="text"
                                      readOnly={true}
                                      className={`tw-outline-none tw-border-none tw-font-sans tw-text-lg tw-tracking-wide tw-capitalize tw-text-txtDark tw-w-full ${isEdit ? "tw-bg-gray-200" : "tw-bg-transparent"
                                        }`}
                                    />

                                    <input
                                      value={exp.companyAndLocation}
                                      onChange={(e) => handleExpChange(i, e)}
                                      name="companyAndLocation"
                                      type="text"
                                      readOnly={true}
                                      className={`tw-outline-none tw-border-none tw-text-sm tw-tracking-wide tw-capitalize tw-text-txtPrimary tw-w-full ${isEdit ? "tw-bg-gray-200" : "tw-bg-transparent"
                                        }`}
                                    />

                                    <textarea
                                      readOnly={true}
                                      className={`tw-text-xs tw-mt-4  tw-text-txtPrimary tw-tracking-wider tw-w-full tw-outline-none tw-border-none ${isEdit ? "tw-bg-gray-200" : "tw-bg-transparent"
                                        }`}
                                      name="description"
                                      value={exp.description}
                                      onChange={(e) => handleExpChange(i, e)}
                                      rows="3"
                                      style={{
                                        maxHeight: "auto",
                                        minHeight: "60px",
                                        resize: "none",
                                      }}
                                    />
                                  </div>
                                </motion.div>
                              ))}
                          </AnimatePresence>
                          <AnimatePresence>
                            {isEdit && (
                              <motion.div
                                {...FadeInOutWIthOpacity}
                                onClick={addExperience}
                                className="tw-cursor-pointer"
                              >
                                <FaPlus className="tw-text-base tw-text-txtPrimary" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* skills */}
                      <div className="tw-w-full">
                        <p className="tw-uppercase tw-text-xl tw-tracking-wider">Skills</p>
                        <div className="tw-w-full tw-h-1 tw-bg-txtDark tw-my-3"></div>
                        <div className="tw-w-full tw-flex tw-flex-wrap tw-items-center tw-justify-start tw-gap-4">
                          <AnimatePresence>
                            {skills &&
                              skills?.map((skill, i) => (
                                <motion.div
                                  key={i}
                                  {...opacityINOut(i)}
                                  className="tw-flex-1"
                                  style={{ minWidth: 225 }}
                                >
                                  <div className="tw-w-full tw-flex tw-items-center tw-justify-between">
                                    <div className="tw-flex tw-items-center tw-justify-center">
                                      <input
                                        value={skill.title}
                                        onChange={(e) => handleSkillsChange(i, e)}
                                        name="title"
                                        type="text"
                                        readOnly={true}
                                        className={`tw-outline-none tw-border-none tw-text-base tw-tracking-wide tw-capitalize tw-font-semibold tw-text-txtPrimary tw-w-full ${isEdit ? "tw-bg-gray-200" : "tw-bg-transparent"
                                          }`}
                                      />

                                      <AnimatePresence>
                                        {isEdit && (
                                          <motion.input
                                            {...FadeInOutWIthOpacity}
                                            value={skill.percentage}
                                            onChange={(e) => handleSkillsChange(i, e)}
                                            name="percentage"
                                            type="text"
                                            className={`tw-outline-none tw-border-none tw-text-base tw-tracking-wide tw-capitalize tw-font-semibold tw-text-txtPrimary tw-w-full ${isEdit
                                              ? "tw-bg-gray-200"
                                              : "tw-bg-transparent"
                                              }`}
                                          />
                                        )}
                                      </AnimatePresence>
                                    </div>

                                    <AnimatePresence>
                                      {isEdit && (
                                        <motion.div
                                          {...FadeInOutWIthOpacity}
                                          onClick={() => removeSkill(i)}
                                          className="tw-cursor-pointer"
                                        >
                                          <FaTrash className="tw-text-base tw-text-txtPrimary" />
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                  <div className="tw-relative tw-mt-2 tw-w-full tw-h-1 tw-rounded-md tw-bg-gray-400">
                                    <div
                                      className="tw-h-full tw-rounded-md tw-bg-gray-600"
                                      style={{
                                        width: `${skill.percentage}%`,
                                        transition: "width 0.3s ease",
                                      }}
                                    ></div>
                                  </div>
                                </motion.div>
                              ))}
                          </AnimatePresence>
                        </div>
                        <AnimatePresence>
                          {isEdit && (
                            <div className="tw-w-full tw-flex tw-items-center tw-justify-center tw-py-4">
                              <motion.div
                                {...FadeInOutWIthOpacity}
                                onClick={addSkill}
                                className="tw-cursor-pointer"
                              >
                                <FaPlus className="tw-text-base tw-text-txtPrimary" />
                              </motion.div>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Template1