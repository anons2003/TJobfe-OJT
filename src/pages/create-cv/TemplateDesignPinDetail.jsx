import React from 'react';
import { Link, useParams } from 'react-router-dom';
import MainSpinner from '../../components/MainSpinner';
import { FaHouse } from 'react-icons/fa6';
import { BiSolidHeart } from 'react-icons/bi';
import { AnimatePresence } from 'framer-motion';
import TemplateDesignPin from '../../components/template-design/TemplateDesignPin';
import useTemplate from '../../hook/useTemplate.js';
import useTemplateDetails from '../../hook/useTemplateDetails.js';
import NavbarDark from '../../components/navbarDark';
import Footer from '../../components/footer';
import ScrollTop from '../../components/scrollTop';
import bg1 from "../../assets/images/hero/bg4.jpg"
const TemplateDesignPinDetail = () => {
    const { templateID } = useParams();
    const { data, isError, isLoading } = useTemplateDetails(templateID);
    const { data: templates } = useTemplate();
    console.log("Data:", data);
    console.log("Template ID:", templateID);
    if (isLoading) {
        return <MainSpinner />;
    }
    if (isError) {
        return (
            <div className='tw-w-full tw-h-[60vh] tw-flex tw-flex-col tw-items-center tw-justify-center'>
                <p className='tw-text-lg tw-text-txtPrimary tw-font-semibold'>Error when fetching data....Please try again</p>
            </div>
        );
    }
    return (
        <>
            <NavbarDark />
            <section>
                <div className='tw-w-9/12 tw-flex tw-items-centere tw-justify-start tw-flex-col tw-px-16 tw-py-9' style={{ margin: '0 auto', marginTop: '60px', marginBottom: '50px' }}>
                    <div className='tw-w-full tw-flex tw-items-center tw-pb-8 tw-gap-2'>
                        <Link
                            to="/"
                            className='tw-flex tw-items-center tw-gap-2 tw-text-txtPrimary tw-text-sm tw-justify-center'
                        >
                            <FaHouse />Home
                        </Link>
                        <p style={{ marginBottom: '0px' }}>/</p>
                        <p style={{ marginBottom: '0px' }}>{data?.name}</p>
                    </div>

                    {/* design main section */}
                    <div className='tw-w-full tw-grid tw-grid-cols-1 lg:tw-grid-cols-12'>
                        {/* left section */}
                        <div className='tw-col-span-1 lg:tw-col-span-8 tw-flex tw-items-start tw-justify-start tw-gap-4'>
                            {/* template image */}
                            <img className='tw-w-full tw-h-auto tw-object-contain tw-rounded-md'
                                src={data?.imageURL}
                                alt=''
                            />
                            {/* title and other option */}
                            <div className='tw-w-full tw-flex tw-flex-col tw-items-start tw-justify-start tw-gap-2'>
                                {/* title section */}
                                <div className='tw-w-full tw-flex tw-items-start tw-justify-between'>
                                    {/* title */}
                                    <p className='tw-text-base tw-text-txtPrimary tw-font-semibold'>{data?.title}</p>
                                    {/* like */}
                                    {data?.favourites?.length > 0 && (
                                        <div className='tw-flex tw-items-center tw-gap-1 tw-justify-center'>
                                            <BiSolidHeart className='tw-text-base tw-text-red-500' />
                                            <p className='tw-text-base tw-text-txtPrimary tw-font-semibold'>{data?.favourites?.length} likes</p>
                                        </div>
                                    )}
                                </div>
                                {/* collection favourite options */}
                            </div>
                        </div>
                        {/* right section */}
                        <div className='tw-col-span-1 lg:tw-col-span-4 tw-w-full tw-flex tw-flex-col tw-items-center tw-justify-start tw-px-3 tw-gap-6'>
                            <div className='tw-w-full tw-h-72 tw-bg-blue-200 tw-rounded-md tw-oveflow-hidder tw-relative' style={{ backgroundImage: `url(${bg1})`, backgroundPosition: "center", backdropSize: "cover" }}>
                                {/* discover more option  */}
                                <div className='tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-[rbga(0,0,0,4)]'>
                                    <Link to="/template" className='tw-px-4 tw-py-2 tw-rounded-md tw-border-gray-200 tw-text-white'>
                                        Discover More
                                    </Link>
                                </div>
                            </div>

                            {/* edit the template option  */}
                            <Link
                                className='tw-w-full tw-px-4 tw-py-3 tw-rounded-md tw-flex tw-items-center tw-justify-center tw-bg-blue-500 tw-cursor-pointer'
                                to={`/resume/${data?.name}?templateId=${templateID}`} >
                                <p className='tw-text-white tw-font-semibold tw-text-lg' name="edit-template"> Edit this template </p>
                            </Link>

                            {/* tags */}
                            <div className='tw-w-full tw-flex tw-items-center tw-justify-start tw-flex-warp tw-gap-2'>
                                {data?.tag?.map((tag, index) => (
                                    <p key={index} className='tw-text-xs tw-boder tw-border-gray-300 tw-px-2 tw-py-1 tw-rounded-md tw-whitespace-nowrap'>
                                        {tag}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* similar template */}
                    {templates?.filter((temp) => temp._id !== data?._id).length > 0 && (
                        <div className='tw-w-full tw-py-8 tw-flex tw-flex-col tw-items-start tw-justify-start tw-gap-4'>
                            <p className='tw-text-lg tw-font-semibold tw-text-txtDark'> You might also like</p>
                            <div className='tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 2xl:tw-grid-cols-4 tw-gap-2'>
                                <React.Fragment>
                                    <AnimatePresence>
                                        {templates?.filter((temp) => temp._id !== data?._id).map((template, index) => (
                                            <TemplateDesignPin
                                                key={template?._id}
                                                data={template}
                                                index={index}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </React.Fragment>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <Footer top={false} />
            <ScrollTop />
        </>
    )
}

export default TemplateDesignPinDetail;
