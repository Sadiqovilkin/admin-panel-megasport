import CloseIcon from "../../assets/Icons/CloseIcon";
import styles from "./Modal.module.scss";
import { UseGlobalContext } from "../../Context/GlobalContext";
import { useEffect } from "react";
import InputComponent from "../InputComponent/InputComponent";

export default function Modal({ ModalData, formSubmitFunc, title }) {
  const { showHiddenModal, closeOpenModalFunc } = UseGlobalContext();

  useEffect(() => {
    document.body.style.overflow = showHiddenModal ? "hidden" : "auto";
  }, [showHiddenModal]);

  if (!showHiddenModal) return null;
  
  return (
    <div className={styles.modalWrapper}>
      <div onClick={closeOpenModalFunc} className="overlay"></div>
      <div className={styles.modalArea}>
        <span onClick={closeOpenModalFunc} className={styles.closeModalIcon}>
          <CloseIcon />
        </span>
        <h4 className={styles.title}>{title}</h4>
        <form className={styles.formWrapper} onSubmit={formSubmitFunc}>
          <div className={styles.inputListWrapper}>
            {ModalData.map((item) => (
              <InputComponent inputData={item} key={item.id} />
            ))}
          </div>
          <button type="submit" className={styles.saveBtn}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
