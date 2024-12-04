import React, { useContext } from "react";
import "./navbar.scss";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import { DarkModeContext } from "../../context/darkModeContext";

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="items">
          {/* Fullscreen Icon */}
          <div className="item" onClick={toggleFullscreen}>
            <FullscreenExitOutlinedIcon className="icon" />
          </div>

          {/* Avatar Image */}
          <div className="item">
            <img
              src="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg"
              alt="User Avatar"
              className="avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;