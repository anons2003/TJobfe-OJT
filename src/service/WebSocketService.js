import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connect = (userId, onMessageReceived) => {
  const socket = new SockJS("http://localhost:8080/ws"); // Adjust the URL to your server's WebSocket endpoint
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => {
      console.log(str);
    },
    onConnect: (frame) => {
      console.log("Connected: " + frame);
      stompClient.subscribe(
        `/topic/notifications/${userId}`,
        onMessageReceived
      );
    },
    onStompError: (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    },
  });

  stompClient.activate();
};

export const disconnect = () => {
  if (stompClient !== null) {
    stompClient.deactivate();
  }
  console.log("Disconnected");
};

export const sendMessage = (msg) => {
  if (stompClient !== null && stompClient.connected) {
    stompClient.publish({
      destination: "/app/hello",
      body: JSON.stringify(msg),
    });
  }
};
