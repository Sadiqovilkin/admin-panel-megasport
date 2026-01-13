import { Switch } from "antd";
import styles from "./Input.module.scss";
import ShowParolIcon from "../../assets/Icons/ShowParolIcon";
import { useState } from "react";
import HiddenParolIcon from "../../assets/Icons/HiddenParolIcon";

export default function Input({ inputData, value, onChange }) {
  const [showHiddenPassword, setShowHiddenPassword] = useState(false);

  const funcShowHiddenPassword = () => {
    setShowHiddenPassword(!showHiddenPassword);
  };

  return (
    <div className={styles.imputWrapper}>
      {inputData.inputType !== "switch" && (
        <label htmlFor={inputData.id}>{inputData.label}</label>
      )}
      {(() => {
        if (inputData.inputType === "select") {
          return ( 
            <select
              name={inputData.name}
              value={value}
              onChange={onChange}
              className={styles.selectInp}
            >
              <option value="">
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
                value={value ?? ""}
                className={styles.input}
                onChange={onChange}
              />
              <span
                onClick={funcShowHiddenPassword}
                className={styles.showHiddenPasswordIcon}
              >
                {showHiddenPassword ? <HiddenParolIcon /> : <ShowParolIcon />}
              </span>
            </div>
          );
        else if (inputData.inputType === "checkbox") {
          return inputData.checkboxData.map((item) => (
            <label key={item.id} className={styles.checkedInputWrapper}>
              <input
                type="checkbox"
                name={inputData.name}
                value={item}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange({
                      target: {
                        name: inputData.name,
                        value: [...value, item],
                      },
                    });
                  } else {
                    onChange({
                      target: {
                        name: inputData.name,
                        value: value.filter((v) => v !== item),
                      },
                    });
                  }
                }}
                checked={value.includes(item)}
                className={styles.checkInp}
              />
              {item}
              <span className={styles.checkMark}></span>
            </label>
          ));
        } else if (inputData.inputType === "switch") {
          return (
            <div className={styles.switchInput}>
              <label htmlFor={inputData.id}>{inputData.label}</label>
              <Switch
                checked={value}
                onChange={(checked) =>
                  onChange({
                    target: {
                      name: inputData.name,
                      value: checked,
                    },
                  })
                }
              />
            </div>
          );
        } else {
          return (
            <input
              name={inputData.name}
              type={inputData.inputType}
              className={styles.input}
              value={value}
              onChange={onChange}
            />
          );
        }
      })()}
    </div>
  );
}
