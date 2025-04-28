// SocialBar.jsx – Sticky social media bar for SimplyAG
// Displays social icons fixed to the left side of the screen
// Updated: April 21, 2025

import { FaYoutube, FaInstagram, FaTiktok, FaEnvelope } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThreads } from "@fortawesome/free-brands-svg-icons";
import "../Styles/socialbar.css";

const SocialBar = () => {
  return (
    <div className="social-bar">
      <a href="https://www.youtube.com/@WeAreSimplyAG" target="_blank" rel="noreferrer" title="YouTube">
        <FaYoutube />
      </a>
      <a href="https://www.instagram.com/WeAreSimplyAG" target="_blank" rel="noreferrer" title="Instagram">
        <FaInstagram />
      </a>
      <a href="https://www.tiktok.com/@WeAreSimplyAG" target="_blank" rel="noreferrer" title="TikTok">
        <FaTiktok />
      </a>
      <a href="https://www.threads.net/@WeAreSimplyAG" target="_blank" rel="noreferrer" title="Threads">
        <FontAwesomeIcon icon={faThreads} className="threads-icon" />
      </a>
      <a href="mailto:itssimplyag@gmail.com" title="Email">
        <FaEnvelope />
      </a>
    </div>
  );
};

export default SocialBar;
