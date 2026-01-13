import { useEffect } from "react";
import { UseGlobalContext } from "../../Context/GlobalContext";
import styles from "./ModalForDelete.module.scss"
import CloseIcon from "../../assets/Icons/CloseIcon";

export default function ModalForDelete({ deleteFunc, deleteItemId }) {
  const { deleteForModalShowHiddenFunc, deleteForModal } = UseGlobalContext();

  useEffect(() => {
    document.body.style.overflow = deleteForModal ? "hidden" : "auto";
  }, [deleteForModal]);

  if (!deleteForModal) return null;

  return (
    <div className={styles.deleteModalArea}>
      <div onClick={deleteForModalShowHiddenFunc} className="overlay"></div>

      <div className={styles.modalContent}>
        <span
          onClick={deleteForModalShowHiddenFunc}
          className={styles.closeModalIcon}
        >
          <CloseIcon />
        </span>
        <h4 className={styles.deleteQuestion}>
          This action cannot be undone. Do you really want to delete?
        </h4>
        <div className={styles.yesNoBtn}>
          <span onClick={deleteForModalShowHiddenFunc} className={styles.noBtn}>
            No
          </span>
          <span onClick={()=>deleteFunc(deleteItemId)} className={styles.yesBtn}>
            yes, delete
          </span>
        </div>
      </div>
    </div>
  );
}
