import React from "react";

import "./Intro.css";
import { getImageUrl } from "../../utils";
import { Mail } from "lucide-react";

export const Intro = () => {
  return (
    <section className="intro-section">
      <div className="content">
        <h1 className="title">Hi, I'm Lawrence!</h1>
        <p className="description">
          I'm a full-stack developer with interest in AI and evolving technologies!
          I have with 5 years of experience with Python and Java. Feel free to reach out, happy to chat!
        </p>
        <div className="button-container">
          <a href="mailto:lawrencezou3s@gmail.com" className="contact-button">
            <Mail />
            Let's Connect
          </a>
        </div>
      </div>
      <div className="profile-image-container">
        <img
          src={getImageUrl("hero/LawrenceProfileRounded.png")}
          alt="Lawrence's Profile Photo"
          className="profile-image"
        />
      </div>
    </section>
  );
};
