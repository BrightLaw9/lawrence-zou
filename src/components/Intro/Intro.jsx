import React from "react";

import "./Intro.css";
import { getImageUrl } from "../../utils";
import { Mail } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const Intro = () => {

  const traits = ['Innovator', 'Math and CS Student at UWaterloo', 'Full Stack Developer', 
      'Entrepreneur', 'Machine Learning Enthusiast'];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const profileImgUrl = getImageUrl("hero/LawrenceProfileRounded.png");

  useEffect(() => { 
    const interval = setInterval(() => { 
      var randIndex = Math.floor(Math.random() * traits.length); 
      if (randIndex === traits.length) randIndex--; 
      if (randIndex === selectedIndex) { 
        randIndex = (randIndex + 1) % traits.length; 
      }
      setSelectedIndex(randIndex);
    }, 4000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <section className="intro-section">
      <div className="content">
        <h1 className="title">Hi, I'm Lawrence!</h1>
        <h2 className="sub-description">I'm a &nbsp;
          {traits.map((trait, index) => { 
            return (
              <span key={index} className={index === selectedIndex ? "active" : ""}>
                {trait}
              </span>
            )
          })}
        </h2>
        {/* <p className="description">
          I'm a full-stack developer with interest in AI and evolving technologies!
          I have with 5 years of experience with Python and Java. Feel free to reach out, happy to chat!
        </p> */}
        <div className="button-container">
          <a href="mailto:lawrencezou3s@gmail.com" className="contact-button">
            <Mail />
            Let's Connect
          </a>
        </div>
      </div>
      <div className="profile-image-container">
        <img
          src={profileImgUrl}
          //alt="Lawrence's Profile Photo"
          className="profile-image"
        />
      </div>
    </section>
  );
};
