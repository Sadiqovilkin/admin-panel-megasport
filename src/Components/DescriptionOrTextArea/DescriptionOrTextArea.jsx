// import { useState } from "react";
import styles from "./DescriptionOrTextArea.module.scss"

export default function DescriptionOrTextArea({descriptionDatas, activeLang, setActiveLang}) {
      const langList = ["az", "en", "ru"];
    // const [activeLang, setActiveLang] = useState("az");

     const onClikcChangeLang = (lang) => {
       setActiveLang(lang);
     };
  return (
    <div className={styles.descriptionOrTextAreaWrapper}>
      <span className={styles.textAreaName}>{descriptionDatas.label}</span>
          {descriptionDatas.langShow && <div className={styles.langArea}>
              {langList.map((lang, index) => (
                  <span
                      key={index}
                      onClick={() => onClikcChangeLang(lang)}
                      className={`${styles.lang} ${activeLang === lang ? styles.activeLang : ""
                          }`}
                  >
                      {lang.toLocaleUpperCase()}
                  </span>
              ))}
          </div>} 
      <textarea name={descriptionDatas.name} onChange={descriptionDatas.onChange} value={descriptionDatas.inpValue} rows={descriptionDatas.rows} className={styles.description}></textarea>
    </div>
  );
}
