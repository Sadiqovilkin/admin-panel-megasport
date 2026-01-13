import styles from "./ProductModal.module.scss";
import { UseGlobalContext } from "../../Context/GlobalContext";
import CloseIcon from "../../assets/Icons/CloseIcon";
import ImageAddIcon from "../../assets/Icons/ImageAddIcon";
import InputComponent from "../InputComponent/InputComponent";
import DescriptionOrTextArea from "../DescriptionOrTextArea/DescriptionOrTextArea";
import { Switch, Table } from "antd";
import EditIcon from "../../assets/Icons/EditIcon";
import DeleteIcon from "../../assets/Icons/DeleteIcon";
import ProductOptionModal from "../ProductOptionModal/ProductOptionModal";
import { useEffect, useState } from "react";
import megaSportAdminPanel from "../../Helpers/Helpers";
import url from "../../ApiUrls/Url";

export default function ProductModal({
  modalInputsData,
  modalActivePage,
  modalPageNameList,
  addProductImages,
  deleteProductImage,
  onClickChangeModalPage,
  activeLang,
  setActiveLang,
  submitFunc,
  productFormik,
  findProductItem,
}) {
  const {
    closeOpenModalFunc,
    secondShowHiddenModal,
    closeOpenSecondModalFunc,
  } = UseGlobalContext();

  const [findProductOptionItem, setFindProductOptionItem] = useState({});
  const [categorySearchData, setCategorySearchData] = useState([]);
  const [searchInpValue, setSearchInpValue] = useState("");
  const [showCategoryResultArea, setShowCategoryResultArea] = useState(false);

  const categorySearchFunc = async (data) => {
    try {
      const resData = await megaSportAdminPanel
        .api()
        .get(url.categorySearch(data, findProductItem?.id));
      setCategorySearchData(resData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("category inp search value=", searchInpValue);
  // console.log("category search result=", categorySearchData);

  const findProductOptionFunc = (optionId) => {
    if (!optionId) {
      setFindProductOptionItem({});
      return;
    }
    const findProductOption = productFormik.values.options.find(
      (option) => option.id === optionId
    );
    setFindProductOptionItem(findProductOption);
  };

  const handleProductOptionChange = (field, value) => {
    setFindProductOptionItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (findProductItem) {
      setSearchInpValue(findProductItem.category || "");
      productFormik.setFieldValue("category", findProductItem.categoryId || "");
    } else {
      setSearchInpValue("");
      productFormik.setFieldValue("category", "");
    }
  }, [findProductItem]);


  const modalOptionsAreaInputsDatas = [
    {
      id: 7,
      label: "Value",
      inputType: "text",
      name: "value",
      inpValue: findProductOptionItem.value || "",
      onChange: (e) => handleProductOptionChange("value", e.target.value),
    },
    {
      id: 8,
      label: "Price",
      inputType: "text",
      name: "price",
      inpValue: findProductOptionItem.price || "",
      onChange: (e) => handleProductOptionChange("price", e.target.value),
    },
    {
      id: 9,
      label: "Discount Price",
      inputType: "text",
      isDisabled: true,
      name: "discountedPrice",
      inpValue: findProductOptionItem.discountedPrice || 0,
    },
    {
      id: 10,
      label: "Stock",
      inputType: "text",
      name: "stock",
      inpValue: findProductOptionItem.stock || "",
      onChange: (e) => handleProductOptionChange("stock", e.target.value),
    },
  ];
  const productOptionsTable = [
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div className="icon-list">
          <span
            onClick={() => {
              closeOpenSecondModalFunc();
              findProductOptionFunc(record.id);
            }}
          >
            <EditIcon />
          </span>
          <span
            onClick={() => {
              const filteredOptions = productFormik.values.options.filter(
                (option) => option.id !== record.id
              );
              productFormik.setFieldValue("options", filteredOptions);
            }}
          >
            <DeleteIcon />
          </span>
        </div>
      ),
    },
  ];
  // console.log("find product item --", findProductItem);

  return (
    <div className={styles.modal}>
      <div onClick={closeOpenModalFunc} className="overlay"></div>
      <div className={styles.modalContent}>
        <h4 className="pageTitle">Add New Products</h4>
        <span onClick={closeOpenModalFunc} className={styles.closeIcon}>
          <CloseIcon />
        </span>
        <div className={styles.modalPageList}>
          {modalPageNameList.map((pageName, index) => (
            <span
              className={`${styles.modalPageName} ${
                modalActivePage === pageName ? styles.activePage : ""
              }`}
              onClick={() => onClickChangeModalPage(pageName)}
              key={index}
            >
              {pageName}
            </span>
          ))}
        </div>
        <form className={styles.form} onSubmit={submitFunc}>
          {modalActivePage === "Add Product" && (
            <div className={styles.modalAddProductArea}>
              <div className={styles.addProductForm}>
                <div className={styles.nameSlugCategoryInputs}>
                  <InputComponent
                    inputData={modalInputsData.productName}
                    activeLang={activeLang}
                    setActiveLang={setActiveLang}
                  />
                  <InputComponent inputData={modalInputsData.slug} />
                  <div className={styles.categoryInpWrapper}>
                    <span className="inputName">Category</span>
                    <input
                      className="input"
                      placeholder="Kateqoriya axtarın"
                      value={searchInpValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSearchInpValue(val);
                        if (val.trim().length > 0) {
                          categorySearchFunc(val);
                          setShowCategoryResultArea(true);
                        } else {
                          setCategorySearchData([]);
                          setShowCategoryResultArea(false);
                          productFormik.setFieldValue("category", "");
                        }
                      }}
                    />
                    {searchInpValue.length > 0 && (
                      <span
                        onClick={() => {
                          setSearchInpValue(""),
                            setShowCategoryResultArea(false);
                        }}
                        className={styles.resetInput}
                      >
                        <CloseIcon />
                      </span>
                    )}
                    {showCategoryResultArea && (
                      <div className={styles.categorySearchResultArea}>
                        {(() => {
                          // if (
                          //   findProductItem &&
                          //   searchInpValue ===
                          //     (findProductItem?.title?.az || "")
                          // ) {
                          //   return null;
                          // }
                          if (
                            searchInpValue.length > 0 &&
                            categorySearchData.length > 0
                          ) {
                            return categorySearchData.map((item) => (
                              <span
                                key={item.id}
                                className={styles.categoryName}
                                onClick={() => {
                                  setSearchInpValue(item?.name?.az || "");
                                  productFormik.setFieldValue(
                                    "category",
                                    item.id
                                  );
                                  setShowCategoryResultArea(false);
                                }}
                              >
                                {item?.name?.az}
                              </span>
                            ));
                          }
                          if (
                            searchInpValue.length > 0 &&
                            categorySearchData.length === 0
                          ) {
                            return (
                              <div className={styles.noCategory}>
                                <span
                                  style={{
                                    color: "red",
                                    paddingLeft: "10px",
                                    fontWeight: "800",
                                  }}
                                >
                                  {searchInpValue}
                                </span>
                                adında kateqoriya yoxdur
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                </div>
                <DescriptionOrTextArea
                  descriptionDatas={modalInputsData.description}
                  activeLang={activeLang}
                  setActiveLang={setActiveLang}
                />
                <span className="inputName">isActive</span>
                {/* <Switch
                  checked={productFormik.isActive}
                  onChange={(checked) =>
                    productFormik.setFieldValue("isActive", checked)
                  }
                /> */}
                <Switch
                  checked={productFormik.values.isActive}
                  onChange={(checked) =>
                    productFormik.setFieldValue("isActive", checked)
                  }
                />

                <div className={styles.imgAddAreaWrapper}>
                  <label>Image Upload</label>
                  <div className={styles.imgAddWrapper}>
                    <input
                      type="file"
                      onChange={addProductImages}
                      className={styles.imgInput}
                    />
                    <ImageAddIcon />
                    Image Upload
                  </div>
                  <div className={styles.productImagesArea}>
                    {productFormik.values.images.map((img, index) => (
                      <div key={index} className={styles.productImageWrapper}>
                        <img
                          src={`${megaSportAdminPanel.baseUrlImage}/product/${img}`}
                          alt=""
                        />
                        <span
                          onClick={() => deleteProductImage(img)}
                          className={styles.deleteImage}
                        >
                          <CloseIcon />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button type="submit" className="saveBtn">
                Save
              </button>
            </div>
          )}

          {modalActivePage === "Options" && (
            <>
              <Table
                className="options-table"
                columns={productOptionsTable}
                dataSource={productFormik?.values?.options || []}
                rowKey="id"
              />
              <span
                className={styles.addOptionsBtn}
                onClick={() => {
                  closeOpenSecondModalFunc();
                  findProductOptionFunc();
                }}
              >
                Add New Option +
              </span>
              <button type="submit" className="saveBtn">
                Bütün məhsuları yadda saxla
              </button>
            </>
          )}

          {modalActivePage === "Seo" && (
            <div className={styles.modalSeoArea}>
              <div className={styles.seoForm}>
                {modalInputsData.modalSeoAreaInputsData.seoTextAreaDatas.map(
                  (item) => (
                    <DescriptionOrTextArea
                      key={item.id}
                      descriptionDatas={item}
                      activeLang={activeLang}
                      setActiveLang={setActiveLang}
                    />
                  )
                )}
              </div>
              <InputComponent
                inputData={modalInputsData.modalSeoAreaInputsData.isActive}
              />
              <button type="submit" className="saveBtn">
                Save
              </button>
            </div>
          )}
        </form>
      </div>
      {secondShowHiddenModal && (
        <ProductOptionModal
          modalOptionsAreaInputsDatas={modalOptionsAreaInputsDatas}
          modalActivePage={modalActivePage}
          modalPageNameList={modalPageNameList}
          onClickChangeModalPage={onClickChangeModalPage}
          activeLang={activeLang}
          setActiveLang={setActiveLang}
          productFormik={productFormik}
          findProductOptionItem={findProductOptionItem}
        />
      )}
    </div>
  );
}
