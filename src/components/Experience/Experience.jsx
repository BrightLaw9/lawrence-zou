import React from "react";

import styles from "./Experience.module.css";
import skills from "../../data/skills.json";
import history from "../../data/history.json";
import { getImageUrl } from "../../utils";

export const Experience = () => {
  return (
    <section className={styles.container} id="experience">
      <h2 className={styles.title}>Experience</h2>
      <div className={styles.content}>
      <ul className={styles.history}>
  {skills.map((skillGroup, index) => ( 
    <li key={index} className={styles.historyItem}>
      <div className={styles.experienceContainer}>
      <div className={styles.skillGroup}>
        {skillGroup.map((skill, skillIndex) => ( 
          <div key={skillIndex} className={styles.skill}>
            <div className={styles.skillImageContainer}>
              <img src={getImageUrl(skill.imageSrc)} alt={skill.title} />
            </div>
        <p>{skill.title}</p>
        </div>
        ))}
      </div>

      {history[index] && (
          <ul className={styles.historyUl}>
              <li key={index} className={styles.historyItem}>
                <img
                  className={styles.historyImg}
                  src={getImageUrl(history[index].imageSrc)}
                  alt={`${history[index].organisation} Logo`}
                />
                <div className={styles.historyItemDetails}>
                  <h3>{`${history[index].role}, ${history[index].organisation}`}</h3>
                  <p>{`${history[index].startDate} - ${history[index].endDate}`}</p>
                  <ul>
                    {history[index].experiences.map((experience, id) => {
                      return <li key={id}>{experience}</li>;
                    })}
                  </ul>
                </div>
              </li>
            </ul>
            )
          }
          </div>
    </li>
  ))}
</ul>
        {/* <ul> 
          <div className={styles.skills}>
          {skills.map((skill, id) => {
            return (
              <div key={id} className={styles.skill}>
                <div className={styles.skillImageContainer}>
                  <img src={getImageUrl(skill.imageSrc)} alt={skill.title} />
                </div>
                <p>{skill.title}</p>
              </div>
            );
          })}
        </div>
        <ul className={styles.history}>
          {history.map((historyItem, id) => {
            return (
              <li key={id} className={styles.historyItem}>
                <img
                  className={styles.historyImg}
                  src={getImageUrl(historyItem.imageSrc)}
                  alt={`${historyItem.organisation} Logo`}
                />
                <div className={styles.historyItemDetails}>
                  <h3>{`${historyItem.role}, ${historyItem.organisation}`}</h3>
                  <p>{`${historyItem.startDate} - ${historyItem.endDate}`}</p>
                  <ul>
                    {historyItem.experiences.map((experience, id) => {
                      return <li key={id}>{experience}</li>;
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
        </ul> */}
      </div>
    </section>
  );
};
