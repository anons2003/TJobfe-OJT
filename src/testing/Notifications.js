import React, { useEffect, useState } from "react";
import { connect, disconnect } from "../service/WebSocketService";
import useJobSeekerInfo from "../hook/useJobSeekerInfo";
import { toast } from "react-toastify";

const Notifications = () => {
  const { data: userData } = useJobSeekerInfo();
  const user = userData?.data;

  const [notifications, setNotifications] = useState([]);

  const onMessageReceived = (msg) => {
    const notification = msg.body;
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      notification,
    ]);
    console.log("this is notification!: ", notification);
    toast.info(notification, {
      autoClose: 5000, // Notification will close after 5 seconds
    });
  };

  useEffect(() => {
    if (user) {
      connect(user?.user.uid, onMessageReceived);
    }
    return () => disconnect();
  }, [user]);

  return null; // No need to render anything specific here
};

export default Notifications;
