import React from "react";
import useTemplate from "../../hook/useTemplate";
import { AnimatePresence } from "framer-motion";
import TemplateDesignPin from "../../components/template-design/TemplateDesignPin";
import Footer from "../../components/footer";
import ScrollTop from "../../components/scrollTop";
import NavbarDark from "../../components/navbarDark";

const TemplateContainer = () => {
  const { data: templates, isError: temp_isError } = useTemplate();

  const RenderAnTemplate = ({ templates, isPro, price }) => {
    return (
      <div>
        {templates && templates.length > 0 ? (
          <AnimatePresence>
            {templates.map((template, index) => (
              <TemplateDesignPin
                key={template?._id}
                data={template}
                index={index}
                isPro={isPro}
                price={price}
              />
            ))}
          </AnimatePresence>
        ) : (
          <p className="text-lg text-txtDark">No template found</p>
        )}
      </div>
    );
  };

  return (
    <>
      <NavbarDark navClass="defaultscroll sticky" navLight={true} />
      <section>
        <div
          className="tw-container"
          style={{ margin: "0 auto", marginTop: "100px", marginBottom: "50px" }}
        >
          {temp_isError ? (
            <p className="tw-text-lg tw-text-txtDark text-align-center">
              Something went wrong... Please try again later
            </p>
          ) : (
            <div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 2xl:tw-grid-cols-4 tw-gap-12">
              <RenderAnTemplate templates={templates} isPro={false} />
              <RenderAnTemplate templates={templates} isPro={true} price={10} />
              {/* <RenderAnTemplate templates={templates} isPro={true} price={30} />
              <RenderAnTemplate templates={templates} isPro={true} price={60} />
              <RenderAnTemplate
                templates={templates}
                isPro={true}
                price={100}
              /> */}
            </div>
          )}
        </div>
      </section>
      <Footer top={false} />
      <ScrollTop />
    </>
  );
};

export default TemplateContainer;
