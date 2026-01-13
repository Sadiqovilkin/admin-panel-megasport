import { useEffect, useState } from "react";
import styles from "./ModalForEditing.module.scss";
import { UseGlobalContext } from "../../Context/GlobalContext";
import CloseIcon from "../../assets/Icons/CloseIcon";
import Input from "../Input/Input";

export default function ModalForEditing({
  title,
  formik,
  passwordFormik,
  modalForEditFormData,
  passwordModalFormData,
  gridTempCol,
  noPasswordArea
}) {
  const { editForModal, editForModalShowHiddenFunc } = UseGlobalContext();
  const [showHiddenPasswordArea, setShowHiddenPasswordArea] = useState(false);

  const funcShowHiddenPasswordArea = () => {
    setShowHiddenPasswordArea(!showHiddenPasswordArea);
  };
  // console.log("paswor form data =", passwordModalFormData);

  useEffect(() => {
    document.body.style.overflow = editForModal ? "hidden" : "auto";
  }, [editForModal]);

  if (!editForModal) return null;

  return (
    <div className={styles.modalArea}>
      <div
        className={styles.overlay}
        onClick={editForModalShowHiddenFunc}
      ></div>
      <div className={styles.modalWrapper}>
        <span
          onClick={editForModalShowHiddenFunc}
          className={styles.closeModalIcon}
        >
          <CloseIcon />
        </span>
        <h4 className={styles.title}>
          {noPasswordArea && showHiddenPasswordArea ? "Edit Password" : title}
        </h4>

        {noPasswordArea && (
          <div className={styles.modalCategoryBtn}>
            <span
              onClick={() => funcShowHiddenPasswordArea()}
              className={`${styles.info} ${
                showHiddenPasswordArea ? styles.activeBtn : ""
              }`}
            >
              Personal İnformation
            </span>
            <span
              onClick={() => funcShowHiddenPasswordArea()}
              className={`${styles.passwordChange} ${
                showHiddenPasswordArea ? "" : styles.activeBtn
              }`}
            >
              Password
            </span>
          </div>
        )}
        {noPasswordArea ? (
          showHiddenPasswordArea ? (
            <form onSubmit={formik.handleSubmit} className={styles.formWrapper}>
              <div
                className={styles.inputListWrapper}
                style={{ gridTemplateColumns: gridTempCol }}
              >
                {modalForEditFormData.map((item) => (
                  <Input
                    key={item.id}
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
          ) : (
            <form onSubmit={passwordFormik?.handleSubmit}>
              <div className={styles.passwordArea}>
                {passwordModalFormData?.map((inputData) => (
                  <Input
                    key={inputData.id}
                    inputData={inputData}
                    value={passwordFormik?.values[inputData.name]}
                    onChange={passwordFormik?.handleChange}
                  />
                ))}
              </div>
              <button type="submit" className={styles.saveBtn}>
                Save
              </button>
            </form>
          )
        ) : (
          <form onSubmit={formik.handleSubmit} className={styles.formWrapper}>
            <div
              className={styles.inputListWrapper}
              style={{ gridTemplateColumns: gridTempCol }}
            >
              {modalForEditFormData.map((item) => (
                <Input
                  key={item.id}
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
        )}
      </div>
    </div>
  );
}
