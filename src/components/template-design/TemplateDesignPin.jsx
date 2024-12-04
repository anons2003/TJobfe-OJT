import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeInOutWIthOpacity, scaleInOut } from "../../animation";
import { useNavigate } from "react-router-dom";
import useEnterpriseInfo from "../../hook/useEnterpriseInfo";
import useJobSeekerInfo from "../../hook/useJobSeekerInfo";
import api from "../../api/http";
import { useMutation } from "@tanstack/react-query";
import "./style.css";

const token = sessionStorage.getItem("token");

const TemplateDesignPin = ({ data, index, isPro, price }) => {
  const { data: jobseekerData } = useJobSeekerInfo();
  const { data: enterpriseData } = useEnterpriseInfo();

  const jobseeker = jobseekerData?.data;
  const enterprise = enterpriseData?.data;
  const user = jobseeker?.user ?? enterprise?.user;
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const paymentMutation = useMutation({
    mutationFn: (formData) => {
      return api.post(
        `payment/buy?amount=${formData.amount}`,
        {},
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  const onfinish = (body) => {
    paymentMutation.mutate(body, {
      onSuccess: (response) => {
        alert("Payment successful");
        navigate(`/resumeDetail/${data?.id}`, { replace: true });
      },
      onError: (error) => {
        console.log(error);
        alert("Payment failed");
      },
    });
  };

  const handleRouteNavigation = () => {
    if (!isPro) {
      navigate(`/resumeDetail/${data?.id}`, { replace: true });
    } else if (user.account_balance >= price) {
      const formData = {
        amount: price,
      };
      onfinish(formData);
    } else {
      navigate("/recharge", { replace: true });
    }
  };

  return (
    <motion.div key={data?.id} {...scaleInOut(index)}>
      <div
        className="tw-w-full tw-h-[450px] 2xl:tw-h-[640px] tw-rounded-md tw-bg-gray-300 tw-overflow-hidden tw-relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={data?.imageURL}
          className="tw-w-full tw-h-full tw-object-cover"
          alt=""
        />
        {isPro && (
          <div className="pro-label">
            Pro
            <p>${price}</p>
          </div>
        )}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              {...FadeInOutWIthOpacity}
              onClick={handleRouteNavigation}
              className={`tw-absolute tw-inset-0 ${
                isPro && user.account_balance < price
                  ? "tw-bg-[rgba(0,0,0,0.4)] tw-flex tw-items-center tw-justify-center"
                  : "tw-bg-[rgba(0,0,0,0.4)] tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-4 tw-py-3"
              } tw-z-50 tw-cursor-pointer`}
            >
              {isPro && user.account_balance < price ? (
                <p className="tw-text-white tw-text-lg">
                  Pro - Please upgrade to view this template
                </p>
              ) : (
                <div className="tw-flex tw-flex-col tw-items-end tw-justify-start tw-w-full tw-gap-8"></div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TemplateDesignPin;
