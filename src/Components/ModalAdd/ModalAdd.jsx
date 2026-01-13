import CloseIcon from "../../assets/Icons/CloseIcon";
import Input from "../Input/Input";
import styles from "./ModalAdd.module.scss";
import { UseGlobalContext } from "../../Context/GlobalContext";
import { useEffect } from "react";

export default function ModalAdd({ ModalData, formik, title, gridTempCol }) {
  const { showHiddenAddModal, closeOpenAddModalFunc } = UseGlobalContext();

  useEffect(() => {
    document.body.style.overflow = showHiddenAddModal ? "hidden" : "auto";
  }, [showHiddenAddModal]);

  if (!showHiddenAddModal) return null; 

  return (
    <div className={styles.modalArea}>
      <div className="overlay" onClick={closeOpenAddModalFunc}></div>
      <div className={styles.modalWrapper}>
        <span onClick={closeOpenAddModalFunc} className={styles.closeModalIcon}>
          <CloseIcon />
        </span>
        <h4 className={styles.title}>{title}</h4>
        <form className={styles.formWrapper} onSubmit={formik.handleSubmit}>
          <div
            style={{ gridTemplateColumns: gridTempCol }}
            className={styles.inputListWrapper}
          >
            {ModalData.map((item, index) => (
              <Input
                key={index}
                inputData={item}
                value={formik.values[item.name]}
                onChange={formik.handleChange}
              />
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
