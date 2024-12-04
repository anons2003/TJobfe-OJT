import React, { useState } from "react";
import NavbarDark from "../../components/navbarDark.js";
import Footer from "../../components/footer.js";
import ScrollTop from "../../components/scrollTop.js";
import { toast } from "react-toastify";
import useTemplate from "../../hook/useTemplate.js";
import 'react-toastify/dist/ReactToastify.css';
import { PuffLoader } from 'react-spinners';
import { FaUpload, FaTrash } from 'react-icons/fa';
import { initialTags } from "../../components/support.js";
import '../../index.css'


export default function CreateTemplate() {
  const [formData, setFormData] = useState({
    title: "",
    name: ""
  });

  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    uri: null,
    progress: 0,
    file: null
  });

  const [selectedTag, setSelectedTag] = useState([]);
  const {
    data: templates,

    mutation,
    deleteMutation
  } = useTemplate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevRec) => ({ ...prevRec, [name]: value }));
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];

    if (file && isAllowed(file)) {
      setImageAsset((prevAsset) => ({
        ...prevAsset,
        isImageLoading: true,
        file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageAsset((prevAsset) => ({
          ...prevAsset,
          uri: reader.result,
          isImageLoading: false
        }));
      };
      reader.readAsDataURL(file);
    } else {
      toast.info("Invalid file format");
    }
  };

  const deleteAnObject = () => {
    setImageAsset({
      isImageLoading: false,
      uri: null,
      progress: 0,
      file: null
    });
  };

  const handleSelectTags = (tag) => {
    if (selectedTag.includes(tag)) {
      setSelectedTag(selectedTag.filter(selected => selected !== tag));
    } else {
      setSelectedTag([...selectedTag, tag]);
    }
  };

  const pushToCloud = async () => {
    if (imageAsset.file) {
      const templateDTO = {
        name: templates && templates.length > 0
          ? `Template ${templates.length + 1}`
          : "template1",
        title: formData.title
      };
      mutation.mutate({ templateDTO, file: imageAsset.file });
    }
  };

  const removeTemplate = async (id) => {
    if (id) {
      console.log("id", id); // Thêm log để kiểm tra giá trị của id
      deleteMutation.mutate(id);
    } else {
      console.error('Template ID is undefined');
    }
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpg", "image/png", "image/jpeg"];
    return allowedTypes.includes(file.type);
  };



  return (
    <>
      <NavbarDark />
      <section>
        <div className="tw-w-full tw-px-4 lg:tw-px-10 2xl:tw-px-32 tw-py-4 tw-grid tw-grid-cols-1 lg:tw-grid-cols-12" style={{ marginTop: '100px' }} >
          <div className="tw-col-span-12 lg:tw-col-span-4 2xl:tw-col-span-3 tw-flex-1 tw-flex tw-items-center tw-justify-start tw-flex-col tw-gap-4 tw-px-2">
            <div className="tw-w-full">
              <p className="tw-text-lg tw-text-txtPrimary">Create a new Template</p>
            </div>
            <div className="tw-w-full tw-flex tw-items-center tw-justify-end">
              <p className="tw-text-base tw-text-txtLight tw-uppercase tw-font-semibold">Template ID:</p>
              <p className="tw-text-sm tw-text-txtDark tw-capitalize tw-font-botl">
                {templates && templates.length > 0 ? `Template ${templates.length + 1}` : "template1"}
              </p>
            </div>
            <input
              className="tw-w-full tw-px-4 tw-py-3 tw-rounded-md tw-bg-transparent tw-border tw-border-gray-300 tw-text-lg tw-text-txtPrimary focus:tw-text-txtDark focus:tw-shadow-md tw-outline-none"
              type="text"
              name="title"
              placeholder="Template title"
              value={formData.title}
              onChange={handleInputChange}
            />
            <div className="tw-w-full tw-bg-gray-100 tw-backdrop-blur-md tw-h-[420px] lg:tw-h-[620px] 2xl:tw-h-[740px] tw-rounded-md tw-border-2 tw-border-dotted tw-border-gray-300 tw-cursor-pointer tw-flex tw-items-center tw-justify-center">
              {imageAsset.isImageLoading ? (
                <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-4">
                  <PuffLoader color="#0000FF" size={40} />
                  <p>{imageAsset.progress.toFixed(2)}%</p>
                </div>
              ) : (
                !imageAsset.uri ? (
                  <label className="tw-w-full tw-cursor-pointer tw-h-full">
                    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full tw-w-full">
                      <div className="tw-flex tw-items-center tw-justify-center tw-cursor-pointer tw-flex-col tw-gap-4">
                        <FaUpload className="tw-text-2xl" />
                        <p className="tw-text-lg tw-text-txtLight">Click to upload</p>
                      </div>
                    </div>
                    <input type="file" className="tw-w-0 tw-h-0" accept=".jpg,.png,.jpeg" onChange={handleFileSelect} />
                  </label>
                ) : (
                  <div className="tw-relative tw-w-full tw-h-full tw-overflow-hidden tw-rounded-md">
                    <img src={imageAsset.uri} className="tw-w-full tw-h-full tw-object-cover" loading="lazy" alt="" />
                    <div className="tw-absolute tw-top-4 tw-right-4 tw-w-8 tw-h-8 tw-rounded-md tw-flex tw-items-center tw-justify-center tw-bg-red-500 tw-cursor-pointer" onClick={deleteAnObject}>
                      <FaTrash className="tw-text-sm tw-text-white" />
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="tw-w-full tw-flex tw-items-center tw-flex-wrap tw-gap-2">
              {initialTags.map((tag) => (
                <div key={tag}
                  className={`tw-border tw-border-gray-400 tw-px-2 tw-py-1 tw-rounded-md tw-cursor-pointer ${selectedTag.includes(tag) ? "tw-bg-blue-500 tw-text-white" : ""}`}
                  onClick={() => handleSelectTags(tag)}>
                  <p className="tw-text-xs">{tag}</p>
                </div>
              ))}
            </div>
            <button type="button" className="tw-w-full tw-bg-blue-300 tw-text-white tw-rounded-md tw-py-3" aria-label="Upload Template" onClick={pushToCloud}>
              Upload Template
            </button>
          </div>
          <div className="tw-col-span-12 lg:tw-col-span-8 2xl:tw-col-span-9 tw-px-2 tw-w-full tw-flex-1 tw-py-4">
            {templates && templates.length > 0 ? (
              <ul className="tw-w-full tw-h-full tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 2xl:tw-grid-cols-4">
                {templates.map((template, index) => (
                  <li
                    key={template.id || index}
                    className="tw-w-full tw-h-[500px] tw-rounded-md tw-overflow-hidden tw-relative"
                  >
                    <img
                      src={template.imageURL}
                      alt=""
                      className="tw-w-full tw-h-full tw-object-cover"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                    <div
                      className="tw-absolute tw-top-4 tw-right-4 tw-w-8 tw-h-8 tw-rounded-md tw-flex tw-items-center tw-justify-center tw-bg-red-500 tw-cursor-pointer"
                      onClick={() => removeTemplate(template.id)}
                    >
                      <FaTrash className="tw-text-sm tw-text-white" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="tw-w-full tw-h-full tw-flex tw-flex-col tw-gap-6 tw-items-center tw-justify-center">
                <PuffLoader color="#498FCD" size={40} />
                <p className="tw-text-xl tw-tracking-wider tw-capitalize tw-text-txtPrimary">
                  No data
                </p>
              </div>
            )
            }
          </div>
        </div>
      </section>
      <Footer top={true} />
      <ScrollTop />
    </>
  );
}