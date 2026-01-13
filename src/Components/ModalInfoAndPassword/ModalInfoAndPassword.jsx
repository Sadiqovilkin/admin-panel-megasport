import { useEffect, useState } from "react";
import styles from "./ModalInfoAndPassword.module.scss";
import { UseGlobalContext } from "../../Context/GlobalContext";
import CloseIcon from "../../assets/Icons/CloseIcon";
import InputComponent from "../InputComponent/InputComponent";

export default function ModalInfoAndPassword({ openFormInputData, sendInfoFunc, sendPasswordFunc,  }) {
  const { editForModal, editForModalShowHiddenFunc } = UseGlobalContext();
  const [activeBtn, setActiveBtn] = useState("infoBtn");

  const onClickBtnChangeArea = (btnName) => {
    setActiveBtn(btnName);
  };

  useEffect(() => {
    document.body.style.overflow = editForModal ? "hidden" : "auto";
  }, [editForModal]);

  if (!editForModal) return null;

  return (
    <div className={styles.modalInfoAndPasswordWrapper}>
      <div className="overlay" onClick={editForModalShowHiddenFunc}></div>
      <div
        style={{ height: activeBtn === "passwordBtn" ? "55vh" : "" }}
        className={styles.infoAndPasswordArea}
      >
        <h2 className="pageTitle">
          {activeBtn === "infoBtn"
            ? "Istifadeki Məlumatlari"
            : "Istifadeki Parolu"}
        </h2>

        <span onClick={editForModalShowHiddenFunc} className={styles.closeIcon}>
          <CloseIcon />
        </span>
        <div className={styles.btnList}>
          <span
            onClick={() => onClickBtnChangeArea("infoBtn")}
            className={`${styles.infoBtn} ${
              activeBtn === "infoBtn" ? styles.btnActived : ""
            }`}
          >
            Personal İnformation
          </span>
          <span
            onClick={() => onClickBtnChangeArea("passwordBtn")}
            className={`${styles.passwordBtn} ${
              activeBtn === "passwordBtn" ? styles.btnActived : ""
            }`}
          >
            Password
          </span>
        </div>
        <div className={styles.formsArea}>
          {activeBtn === "infoBtn" && (
            <form onSubmit={sendInfoFunc}>
              <div className={styles.infoArea}>
                {openFormInputData.infoForm.map((item) => (
                  <InputComponent inputData={item} key={item.id} />
                ))}
              </div>
              <button className={styles.saveBtn}>Save</button>
            </form>
          )}

          {activeBtn === "passwordBtn" && (
            <form onSubmit={sendPasswordFunc}>
              <div className={styles.passwordArea}>
                {openFormInputData.passwordFormData.map((item) => (
                  <InputComponent inputData={item} key={item.id} />
                ))}
              </div>
              <button type="submit" className={styles.saveBtn}>
                Save
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
