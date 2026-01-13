import { Switch } from "antd";
import styles from "./InputComponent.module.scss";
import ShowParolIcon from "../../assets/Icons/ShowParolIcon";
import { useState } from "react";
import HiddenParolIcon from "../../assets/Icons/HiddenParolIcon";
import { IMaskInput } from "react-imask";

export default function InputComponent({
  inputData,
  activeLang,
  setActiveLang,
}) {
  const [showHiddenPassword, setShowHiddenPassword] = useState(false);
  const langList = ["az", "en", "ru"];

  const funcShowHiddenPassword = () => {
    setShowHiddenPassword(!showHiddenPassword);
  };

  const onClikcChangeLang = (lang) => {
    setActiveLang(lang);
  };

  return (
    <div className={styles.imputWrapper}>
      {inputData.inputType !== "switch" && (
        <label htmlFor={inputData.id}>{inputData.label}</label>
      )}
      {inputData.langShow && (
        <div className={styles.langArea}>
          {langList.map((lang, index) => (
            <span
              key={index}
              onClick={() => onClikcChangeLang(lang)}
              className={`${styles.lang} ${
                activeLang === lang ? styles.activeLang : ""
              }`}
            >
              {lang.toLocaleUpperCase()}
            </span>
          ))}
        </div>
      )}
      {(() => {
        if (inputData.inputType === "select") {
          return (
            <select
              name={inputData.name}
              value={inputData.inpValue}
              onChange={inputData.onChange}
              className={styles.selectInp}
              // placeholder={"Seçim edin"}
            >
              <option value="" disabled hidden>
                Seçim edin
              </option>
              {inputData?.selectData?.map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
            </select>
          );
        } else if (inputData.inputType === "password")
          return (
            <div className={styles.passwordInp}>
              <input
                name={inputData.name}
                type={`${showHiddenPassword ? "text" : "password"}`}
                value={inputData.inpValue}
                className={styles.input}
                onChange={inputData.onChange}
              />
              <span
                onClick={funcShowHiddenPassword}
                className={styles.showHiddenPasswordIcon}
              >
                {showHiddenPassword ? <HiddenParolIcon /> : <ShowParolIcon />}
              </span>
            </div>
          );
        else if (inputData.inputType === "IMaskInput") {
          return (
            <IMaskInput
              className={styles.input}
              placeholder={inputData.placeholder}
              mask="00/00/0000"
              definitions={{
                0: /[0-9]/,
              }}
              lazy={true}
              name={inputData.name ? inputData.name : "phone"}
              value={inputData.inpValue}
              onAccept={(value) =>
                inputData.onChange({ target: { name: inputData.name, value } })
              }
            />
          );
        } else if (inputData.inputType === "switch") {
          return (
            <div className={styles.switchInput}>
              <label htmlFor={inputData.id}>{inputData.label}</label>
              <Switch
                checked={inputData.inpValue}
                onChange={(checked) =>
                  inputData.onChange({
                    target: { name: inputData.name, value: checked },
                  })
                }
              />
              {/* <Switch
                checked={inputData.inpValue}
                onChange={(checked) => inputData.onChange(checked)}
              /> */}
            </div>
          );
        } else {
          return (
            <input
              name={inputData.name}
              type={inputData.inputType}
              className={styles.input}
              value={inputData.inpValue}
              onChange={inputData.onChange}
              disabled={inputData.isDisabled}
            />
          );
        }
      })()}
    </div>
  );
}
