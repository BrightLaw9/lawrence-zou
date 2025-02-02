import React from "react";

import styles from "./About.module.css";
import { getImageUrl } from "../../utils";

export const About = () => {
  return (
    <section className={styles.container} id="about">
      <div className={styles.aboutSectionContainer}>
      <h2 className={styles.title}>About</h2>
      <div className={styles.imageFadeContainer}>
          <img
            src={getImageUrl("about/brain-and-creative.png")}
            alt="Fusion between technical and creative thinking"
            className={styles.aboutImage}
          />
        </div>
      <div className={styles.content}>
        <ul className={styles.aboutItems}>
          <li className={styles.aboutItem}>
            <img className={styles.descImage} src={getImageUrl("about/arrow.png")} alt="Cursor icon" />
            <div className={styles.aboutItemText}>
              <h3>Full Stack Developer</h3>
              <p>
                I have experience building front-end systems 
                primarily in HTML, CSS, JS/TS, and React. 
                I've worked with backend systems (Flask), 
                and bridging the two with REST APIs. 
              </p>
            </div>
          </li>
          <li className={styles.aboutItem}>
            <img className={styles.descImage} src={getImageUrl("about/server.png")} alt="Server icon" />
            <div className={styles.aboutItemText}>
              <h3>Machine Learning Enthusiast</h3>
              <p>
                Interested in neural network architectures, 
                training ML to real world applications, and learning
                scaling laws for AI growth
              </p>
            </div>
          </li>
          <li className={styles.aboutItem}>
            <img className={styles.descImage} src={getImageUrl("about/repeat.png")} alt="UI icon" />
            <div className={styles.aboutItemText}>
              <h3>Interest in Innovative Interdisclipinary Ideas</h3>
              <p>
                I believe the greatest solutions will come from bringing 
                near trivial ideas in one field into one that many have not seen before.
                This will allow for meaningful innovation.
              </p>
            </div>
          </li>
        </ul>
      </div>
      </div>
    </section>
  );
};
