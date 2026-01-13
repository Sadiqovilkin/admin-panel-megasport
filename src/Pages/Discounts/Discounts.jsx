import { useEffect, useState } from "react";
import styles from "./Discounts.module.scss";
import SearchIcon from "../../assets/Icons/SearchIcon";
import ArrowDownIcon from "../../assets/Icons/ArrowDownIcon";
import ArrowUpIcon from "../../assets/Icons/ArrowUpIcon";
import AddIcon from "../../assets/Icons/AddIcon";
import FilterIcon from "../../assets/Icons/FilterIcon";
import EditIcon from "../../assets/Icons/EditIcon";
import DeleteIcon from "../../assets/Icons/DeleteIcon";
import { Table } from "antd";
import { UseGlobalContext } from "../../Context/GlobalContext";
import CloseIcon from "../../assets/Icons/CloseIcon";
import InputComponent from "../../Components/InputComponent/InputComponent";
import DescriptionOrTextArea from "../../Components/DescriptionOrTextArea/DescriptionOrTextArea";
import megaSportAdminPanel from "../../Helpers/Helpers";
import url from "../../ApiUrls/Url";
import { useFormik } from "formik";
import moment from "moment";
import ModalForDelete from "../../Components/ModalForDelete/ModalForDelete";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../Components/Pagination/Pagination";


export default function Discounts() {
  const {
    showHiddenModal,
    closeOpenModalFunc,
    deleteForModalShowHiddenFunc
  } = UseGlobalContext();
  const [searchValue, setSearchValue] = useState("");
  const [showHiddenFilterArea, setShowHiddenFilterArea] = useState(false);
  const [activeLang, setActiveLang] = useState("az");
  const [discoutAllDatas, setDiscountAllDatas] = useState([]);
  const [findDiscoutItem, setFindDiscountItem] = useState(null);
  const [searchCategoryInpValue, setsearchCategoryInpValue] = useState("");
  const [categorySearchData, setCategorySearchData] = useState([]);
  const [showHiddenCategoryResult, setShowHiddenCategoryResult] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchProductInpValue, setSearchProductInpValue] = useState("");
  const [productSearchData, setProductSearchData] = useState([]);
  const [showHiddenProductResult, setShowHiddenProductResult] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteDiscountId, setDeletedDiscountId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const sortByParam = searchParams.get("sortBy") || "createdAt";
  const directionParam = searchParams.get("direction") || "ASC";
  const currentPage = Number(searchParams.get("page")) || 1;

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleCategorySearchFunc = async (value, id) => {
    try {
      const resData = await megaSportAdminPanel
        .api()
        .get(url.categorySearch(value, id));
      setCategorySearchData(resData.data.data);
      setShowHiddenCategoryResult(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeCategoryInput = (e) => {
    const value = e.target.value.trim();
    setsearchCategoryInpValue(value);
    if (value.length > 0) {
      handleCategorySearchFunc(value, findDiscoutItem?.id);
    } else {
      setCategorySearchData([]);
    }
  };

  const handleProductSearchFunc = async (data) => {
try {
  const resData = await megaSportAdminPanel.api().get(url.discountProductSearch(data));
  setProductSearchData(resData.data.data);
  setShowHiddenProductResult(true)
} catch (error) {
  console.log(error);
}
  }

  const onChangeProductInput = (e) => {
    const value = e.target.value.trim();
      setSearchProductInpValue(value)
    if (value.length > 0) {
        handleProductSearchFunc(value)
    } else {
        setProductSearchData([])
      }
  }

  console.log("productsearchData---", productSearchData);
  

  const handleFilterArea = () => {
    setShowHiddenFilterArea(!showHiddenFilterArea);
  };

    const handleSortChange = (newSortBy, newDirection) => {
      const newPage =
        newDirection === "DESC" ? discoutAllDatas?.meta?.totalPages || 1 : 1;
      setSearchParams({
        sortBy: newSortBy,
        direction: newDirection,
        page: newPage,
      });
    };

  const getAllDiscout = async (page=1) => {
    try {
      const resData = await megaSportAdminPanel
        .api()
        .get(
          `${url.discountGetAll(
            sortByParam,
            directionParam
          )}&page=${page}&perPage=2`
        );
      setDiscountAllDatas(resData.data);
    } catch (error) {
      console.log(error);
    }
  };

  const findDicoutFunc = (id) => {
    const fundDiscout = discoutAllDatas.data.find((item) => item.id === id);
    setFindDiscountItem(fundDiscout);
  };

    const discountDeleteFunc = async (id) => {
      try {
        await megaSportAdminPanel.api().delete(url.discoutDelete(id));
      } catch (error) {
        console.log(error);
      }
      await getAllDiscout(currentPage);
      deleteForModalShowHiddenFunc();
    };

  const discountFormik = useFormik({
    initialValues: {
      title: {
        az: findDiscoutItem?.title?.az || "",
        en: findDiscoutItem?.title?.en || "",
        ru: findDiscoutItem?.title?.ru || "",
      },
      includeSubcategories: findDiscoutItem?.includeSubcategories || false,
      description: {
        az: findDiscoutItem?.description?.az || "",
        en: findDiscoutItem?.description?.en || "",
        ru: findDiscoutItem?.description?.ru || "",
      },
      type: findDiscoutItem?.type || "",
      value: findDiscoutItem?.value || "",
      isActive: findDiscoutItem?.isActive || false,
      startAt: findDiscoutItem?.startAt
        ? moment(findDiscoutItem.startAt).format("DD/MM/YYYY")
        : "",
      endAt: findDiscoutItem?.endAt
        ? moment(findDiscoutItem.endAt).format("DD/MM/YYYY")
        : "",
      notes: findDiscoutItem?.notes || "",
      maxDiscountAmount: findDiscoutItem?.maxDiscountAmount || "",
      // categories: findDiscoutItem?.categories || [],
      categories: findDiscoutItem?.categories?.map((cat) => cat.id) || [],
      products: findDiscoutItem?.products?.map((pro) => pro.id) || [],
    },
    enableReinitialize: true,
    onSubmit: async (formValues) => {
      const payload = {
        ...formValues,
        value: Number(formValues.value),
        maxDiscountAmount: Number(formValues.maxDiscountAmount) || 0,
        startAt: formValues.startAt
          ? moment(formValues.startAt, "DD/MM/YYYY").format("YYYY-MM-DD")
          : null,
        endAt: formValues.endAt
          ? moment(formValues.endAt, "DD/MM/YYYY").format("YYYY-MM-DD")
          : null,
        categories: formValues.categories,
      };

      try {
        if (findDiscoutItem) {
          await megaSportAdminPanel
            .api()
            .put(url.discountUpdate(findDiscoutItem.id), payload);
        } else {
          await megaSportAdminPanel.api().post(url.discoutCreated, payload);
        }
        getAllDiscout(currentPage);
        discountFormik.resetForm();
        closeOpenModalFunc();
      } catch (error) {
        console.error("Xəta:", error);
      }
    },
  });

  const modalFormData = {
    title: {
      label: "Title",
      inputType: "text",
      langShow: true,
      name: `title.${activeLang}`,
      inpValue: discountFormik.values.title[activeLang],
      onChange: discountFormik.handleChange,
    },
    includeSubcategories: {
      label: "IncludeSubcategories",
      inputType: "switch",
      name: "includeSubcategories",
      inpValue: discountFormik.values.includeSubcategories,
      onChange: discountFormik.handleChange,
    },
    description: {
      label: "Description",
      langShow: true,
      rows: 4,
      name: `description.${activeLang}`,
      inpValue: discountFormik.values.description[activeLang],
      onChange: discountFormik.handleChange,
    },
    value: {
      label: "Value",
      inputType: "text",
      name: "value",
      inpValue: discountFormik.values.value,
      onChange: discountFormik.handleChange,
    },
    type: {
      label: "Type",
      inputType: "select",
      selectData: ["percent", "fixed"],
      name: "type",
      inpValue: discountFormik.values.type,
      onChange: discountFormik.handleChange,
    },
    startAt: {
      label: "Start At",
      inputType: "IMaskInput",
      placeholder: "Başlanğıc tarixi yazın",
      name: "startAt",
      inpValue: discountFormik.values.startAt,
      onChange: discountFormik.handleChange,
    },
    endAt: {
      label: "End At",
      inputType: "IMaskInput",
      placeholder: "Son tarixi yazın",
      name: "endAt",
      inpValue: discountFormik.values.endAt,
      onChange: discountFormik.handleChange,
    },
    note: {
      label: "Notes",
      rows: 3,
      name: "notes",
      inpValue: discountFormik.values.notes,
      onChange: discountFormik.handleChange,
    },
    isActive: {
      label: "Status",
      inputType: "switch",
      name: "isActive",
      inpValue: discountFormik.isActive,
      onChange: discountFormik.handleChange,
    },
  };

  const discountTable = [
    {
      title: "#Id",
      dataIndex: "counterId",
      key: "counterId",
      width: 60,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title) => title.az,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (products) => {
        if (!products || products.length === 0) return "-";

        const displayed = products
          .slice(0, 2)
          .map((product) =>
            typeof product === "object"
              ? product?.title?.az || "Adsız məhsul"
              : product
          )
          .join(", ");
        return products.length > 2 ? `${displayed}...` : displayed;
      },
    },

    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (categories) => {
        if (!categories || categories.length === 0) return "-";
        const displayed = categories
          .slice(0, 2)
          .map((category) => category?.name?.az)
          .join(", ");
        return categories.length > 2 ? `${displayed}...` : displayed;
      },
    },
    {
      title: "StartAt",
      dataIndex: "startAt",
      key: "startAt",
      render: (startAtString) => {
        return startAtString ? moment(startAtString).format("DD MM YYYY") : "-";
      },
    },
    {
      title: "EndAt",
      dataIndex: "endAt",
      key: "endAt",
      render: (endAtString) => {
        return endAtString ? moment(endAtString).format("DD MM YYYY") : "-";
      },
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      width: 150,
      render: (isActive) => (
        <span className={`${isActive ? "activeStatus" : "noActiveStatus"}`}>
          {isActive ? "Active" : "DeActive"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div className="icon-list">
          <span
            onClick={() => {
              findDicoutFunc(record.id);
              setShowHiddenFilterArea(false);
              closeOpenModalFunc();
            }}
          >
            <EditIcon />
          </span>
          <span
            onClick={() => {
              setDeletedDiscountId(record.id);
              deleteForModalShowHiddenFunc();
            }}
          >
            <DeleteIcon />
          </span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (findDiscoutItem?.categories) {
      setSelectedCategories(
        findDiscoutItem.categories.map((cat) => ({
          id: cat.id,
          name: cat.name?.az,
        }))
      );
    } else {
      setSelectedCategories([]);
    }
  }, [findDiscoutItem]);

useEffect(() => {
  if (findDiscoutItem?.products) {
    setSelectedProducts(
      findDiscoutItem.products.map((pro) => ({
        id: pro.id,
        name: pro?.title?.az,
      }))
    );
  } else {
    setSelectedProducts([]);
  }
}, [findDiscoutItem]);


 
  // console.log("category all value ===", discountFormik.values.categories);
  console.log("find discount item ===", findDiscoutItem);

  const handleRemoveCategoryAndProduct = (field, id, setList) => {
    discountFormik.setFieldValue(
      field,
      discountFormik.values[field].filter((itemId) => itemId !== id)
    );

    setList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className={styles.discountPage}>
      <div className="pageHeaderSearchFilterAdd">
        <label className="pageHeaderSearchInputWrapper">
          {searchValue.length > 0 ? "" : <SearchIcon />}
          <input
            className="pageHeaderSearchInput"
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={handleSearch}
          />
        </label>
        <div className="pageHeaderFilterArea">
          <div className="pageHeaderFilterArea">
            <button onClick={handleFilterArea} className="pageHeaderFilterBtn">
              <FilterIcon /> Filter
            </button>

            {showHiddenFilterArea && (
              <div className="pageHeaderFilterContent">
                <span
                  onClick={() => handleSortChange("createdAt", "ASC")}
                  className={`pageHeaderFilterType ${
                    sortByParam === "createdAt" && directionParam === "ASC"
                      ? "activeBtn"
                      : ""
                  }`}
                >
                  Yaranma tarixinə görə <ArrowDownIcon />
                </span>
                <span
                  onClick={() => handleSortChange("createdAt", "DESC")}
                  className={`pageHeaderFilterType ${
                    sortByParam === "createdAt" && directionParam === "DESC"
                      ? "activeBtn"
                      : ""
                  }`}
                >
                  Yaranma tarixinə görə <ArrowUpIcon />
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setFindDiscountItem(null);
              setShowHiddenFilterArea(false);
              closeOpenModalFunc();
            }}
            className="pageHeaderAddBtn"
          >
            <AddIcon />
            Add New Discount
          </button>
        </div>
      </div>

      {showHiddenModal && (
        <div className={styles.modalWrapper}>
          <div onClick={() => closeOpenModalFunc()} className="overlay"></div>
          <div className={styles.modalArea}>
            <h4 className="pageTitle">Add New Discount</h4>
            <span onClick={closeOpenModalFunc} className={styles.closeIcon}>
              <CloseIcon />
            </span>
            <form
              onSubmit={discountFormik.handleSubmit}
              className={styles.formWrapper}
            >
              <InputComponent
                inputData={modalFormData.title}
                activeLang={activeLang}
                setActiveLang={setActiveLang}
              />
              <InputComponent inputData={modalFormData.includeSubcategories} />
              <DescriptionOrTextArea
                descriptionDatas={modalFormData.description}
                activeLang={activeLang}
                setActiveLang={setActiveLang}
              />
              <div className={styles.valueTypeStartEndInputs}>
                <InputComponent inputData={modalFormData.value} />
                <InputComponent inputData={modalFormData.type} />
                <InputComponent inputData={modalFormData.startAt} />
                <InputComponent inputData={modalFormData.endAt} />
              </div>
              <DescriptionOrTextArea descriptionDatas={modalFormData.note} />
              <InputComponent inputData={modalFormData.isActive} />
              <div className={styles.categorySearchWrapper}>
                <span className="inputName">Category</span>
                <input
                  type="text"
                  placeholder="Kateqoriya axtarın"
                  value={searchCategoryInpValue}
                  onChange={onChangeCategoryInput}
                />
                {searchCategoryInpValue.length > 0 && (
                  <span
                    onClick={() => {
                      discountFormik;
                      setsearchCategoryInpValue(""),
                        setShowHiddenCategoryResult(false);
                    }}
                    className={styles.resetInput}
                  >
                    <CloseIcon />
                  </span>
                )}
                {showHiddenCategoryResult && (
                  <div className={styles.searchResultArea}>
                    <span
                      className={styles.areaClose}
                      onClick={() => {
                        setShowHiddenCategoryResult(false),
                          setsearchCategoryInpValue("");
                      }}
                    >
                      <CloseIcon />
                    </span>
                    {(() => {
                      if (
                        searchCategoryInpValue.length > 0 &&
                        categorySearchData.length > 0
                      ) {
                        return categorySearchData?.map((item) => (
                          <span
                            key={item.id}
                            className={styles.resultTitle}
                            onClick={() => {
                              const haveCategory =
                                discountFormik.values.categories.includes(
                                  item.id
                                );
                              if (!haveCategory) {
                                discountFormik.setFieldValue("categories", [
                                  ...discountFormik.values.categories,
                                  item.id,
                                ]);
                                setSelectedCategories((prev) =>
                                  prev.find((cat) => cat.id === item.id)
                                    ? prev
                                    : [
                                        ...prev,
                                        { id: item.id, name: item.name.az },
                                      ]
                                );
                              }
                              setsearchCategoryInpValue("");
                              setShowHiddenCategoryResult(false);
                            }}
                          >
                            {item?.name?.az}
                          </span>
                        ));
                      }
                      if (
                        searchCategoryInpValue.length > 0 &&
                        categorySearchData.length === 0
                      ) {
                        return (
                          <div className={styles.noSearchResult}>
                            <span
                              style={{
                                color: "red",
                                paddingRight: "10px",
                                fontWeight: "800",
                              }}
                            >
                              {searchCategoryInpValue}
                            </span>
                            adında kateqoriya yoxdur
                          </div>
                        );
                      }
                      if (searchCategoryInpValue.length === 0) {
                        setShowHiddenCategoryResult(false);
                      }
                      return null;
                    })()}
                  </div>
                )}
                {selectedCategories.length > 0 && (
                  <div className={styles.checkedCategory}>
                    {selectedCategories.map((categoryName, index) => (
                      <div key={index} className={styles.checkedTitle}>
                        {categoryName.name}
                        <span
                          className={styles.deleteIcon}
                          onClick={() =>
                            handleRemoveCategoryAndProduct(
                              "categories",
                              categoryName.id,
                              setSelectedCategories
                            )
                          }
                        >
                          <CloseIcon />
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.productsSearchWrapper}>
                <span className="inputName">Products</span>
                <input
                  type="text"
                  placeholder="Məhsul axtarın"
                  value={searchProductInpValue}
                  onChange={onChangeProductInput}
                />
                {searchProductInpValue.length > 0 && (
                  <span
                    onClick={() => {
                      setSearchProductInpValue("");
                      setShowHiddenProductResult(false);
                    }}
                    className={styles.resetInput}
                  >
                    <CloseIcon />
                  </span>
                )}

                {showHiddenProductResult && (
                  <div className={styles.searchResultArea}>
                    <span
                      className={styles.areaClose}
                      onClick={() => {
                        setShowHiddenProductResult(false);
                        setSearchProductInpValue("");
                      }}
                    >
                      <CloseIcon />
                    </span>

                    {(() => {
                      if (
                        searchProductInpValue.length > 0 &&
                        productSearchData.length > 0
                      ) {
                        return productSearchData?.map((item) => (
                          <span
                            key={item.id}
                            className={styles.resultTitle}
                            onClick={() => {
                              const alreadySelected =
                                discountFormik.values.products.includes(
                                  item.id
                                );

                              if (!alreadySelected) {
                                discountFormik.setFieldValue("products", [
                                  ...discountFormik.values.products,
                                  item.id,
                                ]);
                                setSelectedProducts((prev) =>
                                  prev.find((pro) => pro.id === item.id)
                                    ? prev
                                    : [
                                        ...prev,
                                        {
                                          id: item.id,
                                          name:
                                            item?.title?.az ||
                                            item?.name?.az ||
                                            item?.title ||
                                            item?.name,
                                        },
                                      ]
                                );
                              }

                              setSearchProductInpValue("");
                              setShowHiddenProductResult(false);
                            }}
                          >
                            {item?.title?.az}
                          </span>
                        ));
                      }

                      if (
                        searchProductInpValue.length > 0 &&
                        productSearchData.length === 0
                      ) {
                        return (
                          <div className={styles.noSearchResult}>
                            <span
                              style={{
                                color: "red",
                                paddingRight: "10px",
                                fontWeight: "800",
                              }}
                            >
                              {searchProductInpValue}
                            </span>
                            adında məhsul yoxdur
                          </div>
                        );
                      }

                      if (searchProductInpValue.length === 0) {
                        setShowHiddenProductResult(false);
                      }

                      return null;
                    })()}
                  </div>
                )}

                {selectedProducts?.length > 0 && (
                  <div className={styles.checkedCategory}>
                    {selectedProducts.map((product, index) => (
                      <div key={index} className={styles.checkedTitle}>
                        {product?.name}
                        <span
                          className={styles.deleteIcon}
                          onClick={() =>
                            handleRemoveCategoryAndProduct(
                              "products",
                              product.id,
                              setSelectedProducts
                            )
                          }
                        >
                          <CloseIcon />
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="saveBtn">
                Send
              </button>
            </form>
          </div>
        </div>
      )}
      <Table
        columns={discountTable}
        dataSource={discoutAllDatas.data}
        rowKey="id"
      />
      <ModalForDelete
        deleteFunc={discountDeleteFunc}
        deleteItemId={deleteDiscountId}
      />
      <Pagination
        func={getAllDiscout}
        pageCountApi={discoutAllDatas?.meta?.totalPages}
        sortByParam={sortByParam}
        directionParam={directionParam}
      />
    </div>
  );
}
