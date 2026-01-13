import styles from "./ProductOptionModal.module.scss";
import { UseGlobalContext } from "../../Context/GlobalContext";
import CloseIcon from "../../assets/Icons/CloseIcon";
import InputComponent from "../InputComponent/InputComponent";

export default function ProductOptionModal({
  modalOptionsAreaInputsDatas,
  modalActivePage,
  productFormik,   
  findProductOptionItem,
}) {
  const { closeOpenSecondModalFunc } = UseGlobalContext();

  return (
    <div className={styles.modal}>
      <div onClick={closeOpenSecondModalFunc} className="overlay"></div>
      <div className={styles.modalContent}>
        <h4 className="pageTitle">Add New Product Option</h4>
        <span onClick={closeOpenSecondModalFunc} className={styles.closeIcon}>
          <CloseIcon />
        </span>
   
        <form className={styles.form}>
          {modalActivePage === "Options" && (
            <div className={styles.modalOptionsArea}>
              <div className={styles.optionsForm}>
                {modalOptionsAreaInputsDatas.map((item) => (
                  <InputComponent key={item.id} inputData={item} />
                ))}
              </div>
              <button
                className="saveBtn" 
                onClick={() => {
                  if (findProductOptionItem?.id) {
                    const updatedOptions = productFormik.values.options.map((option) =>
                      option.id === findProductOptionItem?.id ? findProductOptionItem : option
                    );
                    productFormik.setFieldValue("options", updatedOptions);
                  } else {
                    productFormik.setFieldValue("options", [...productFormik.values.options, findProductOptionItem]);
                  }
                  closeOpenSecondModalFunc();
                }}
              >
                Məlumatları əlavə et
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
