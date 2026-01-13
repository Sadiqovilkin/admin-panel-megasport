import { useEffect, useState } from "react";
import styles from "./Attributes.module.scss";
import SearchIcon from "../../assets/Icons/SearchIcon";
import { UseGlobalContext } from "../../Context/GlobalContext";
import AddIcon from "../../assets/Icons/AddIcon";
import { Switch, Table } from "antd";
import EditIcon from "../../assets/Icons/EditIcon";
import DeleteIcon from "../../assets/Icons/DeleteIcon";
import CloseIcon from "../../assets/Icons/CloseIcon";
import { useFormik } from "formik";
import megaSportAdminPanel from "../../Helpers/Helpers";
import url from "../../ApiUrls/Url";
import ModalForDelete from "../../Components/ModalForDelete/ModalForDelete";

export default function Attributes() {
  const { showHiddenModal, closeOpenModalFunc, deleteForModalShowHiddenFunc } =
    UseGlobalContext();
  const [searchValue, setSearchValue] = useState("");
  const [findAttribute, setFindAttribute] = useState();
  const [allAttributeDatas, setAllAttributeDatas] = useState([]);
  const [activeNameLang, setActiveNameLang] = useState("az");
  const [optionLang, setOptionLang] = useState("az");
  const [deleteAttributeId, setDeleteAttributeId] = useState(null);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const getAllAttributeFunc = async () => {
    try {
      const resData = await megaSportAdminPanel.api().get(url.attributeGetAll);
      setAllAttributeDatas(resData.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllAttributeFunc();
  }, []);

  const findAttributeFuncItem = (id) => {
    const findAttributeItem = allAttributeDatas?.data?.find((item) => item.id === id);
    setFindAttribute(findAttributeItem);
  };

  // console.log("attribut all data == ", allAttributeDatas);
  const attributeForm = useFormik({
    initialValues: {
      name: {
        az: findAttribute?.name?.az || "",
        en: findAttribute?.name?.en || "",
        ru: findAttribute?.name?.ru || "",
      },
      isActive: findAttribute?.isActive || false,
      options: findAttribute?.options || [
        { name: { az: "", en: "", ru: "" }, isActive: false },
      ],
    },
    enableReinitialize: true,
    onSubmit: async (formValue) => {
      if (findAttribute) {
        await megaSportAdminPanel.api().put(url.attributeUpdate(findAttribute.id), formValue) 
      } else {
        await megaSportAdminPanel.api().post(url.attributeCreate, formValue);
      }
      getAllAttributeFunc();
      attributeForm.resetForm();
      setFindAttribute(null);
      closeOpenModalFunc();
    },
  });

  useEffect(() => {
    document.body.style.overflow = showHiddenModal ? "hidden" : "auto";
  }, [showHiddenModal]);

  const deleteAttribute = async (id) => {
    try {
      await megaSportAdminPanel.api().delete(url.attributeDelete(id));
    } catch (error) {
      console.log(error);
    }
    getAllAttributeFunc();
    deleteForModalShowHiddenFunc();
  };

  const columns = [
    {
      title: "#Id",
      dataIndex: "counterId",
      key: "counterId",
      width: 60,
    },
    {
      title: "Attribute Name",
      dataIndex: "name",
      key: "name",
      render: (name) => name.az,
      width: 250,
    },
    {
      title: "Options",
      dataIndex: "options",
      key: "options",
      render: (options) => {
        const activeOptions = options?.filter((opt) => opt.isActive); 
        return (
          <>
            {activeOptions?.length > 0 ? (
              activeOptions.slice(0, 4).map((opt, index) => (
                <span key={index}  className={styles.optionValue}>
                  {opt?.name.az || "-"}
                  {index < activeOptions.length - 1 ? ", " : ""}
                </span>
              ))
            ) : (
              <span>-</span>
            )}
          </>
        );
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
              findAttributeFuncItem(record.id);
              closeOpenModalFunc();
            }}
          >
            <EditIcon />
          </span>
          <span
            onClick={() => {
              setDeleteAttributeId(record.id);
              deleteForModalShowHiddenFunc();
            }}
          >
            <DeleteIcon />
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.attributesPage}>
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
          <button
            onClick={() => {
              setFindAttribute(null);
              closeOpenModalFunc();
            }}
            className="pageHeaderAddBtn"
          >
            <AddIcon />
            Add New Attribute
          </button>
        </div>
      </div>
      {showHiddenModal && (
        <div className={styles.attributeModal}>
          <div onClick={closeOpenModalFunc} className="overlay"></div>
          <div className={styles.modalArea}>
            <h4 className="pageTitle">Add New Attributes</h4>
            <span onClick={closeOpenModalFunc} className={styles.closeIcon}>
              <CloseIcon />
            </span>
            <form
              onSubmit={attributeForm.handleSubmit}
              className={styles.attributeFormArea}
            >
              <div className={styles.attributeName}>
                <span className="inputName">Attribute Name</span>
                <div className="langArea">
                  {["az", "en", "ru"].map((lang, index) => (
                    <span
                      key={index}
                      onClick={() => setActiveNameLang(lang)}
                      className={`lang ${
                        activeNameLang === lang ? "activeLang" : ""
                      }`}
                    >
                      {lang.toUpperCase()}
                    </span>
                  ))}
                </div>
                <input
                  className={styles.attributeInput}
                  name={`name.${activeNameLang}`}
                  onChange={attributeForm.handleChange}
                  value={attributeForm.values.name[activeNameLang]}
                />
              </div>
              <div className={styles.andSwitchInput}>
                <span className="inputName">isActive</span>
                <Switch
                  checked={attributeForm.values.isActive}
                  onChange={(checked) =>
                    attributeForm.setFieldValue("isActive", checked)
                  }
                />
              </div>
              <div className={styles.optionsArea}>
                {attributeForm.values.options.map((option, index) => (
                  <div className={styles.optionInpIsActive} key={index}>
                    <div className={styles.optionInpWrapper}>
                      <span className="inputName">Options</span>
                      <div className="langArea">
                        {["az", "en", "ru"].map((lang) => (
                          <span
                            key={lang}
                            onClick={() => setOptionLang(lang)}
                            className={`lang ${
                              optionLang === lang ? "activeLang" : ""
                            }`}
                          >
                            {lang.toUpperCase()}
                          </span>
                        ))}
                      </div>
                      <input
                        className={styles.attributeInput}
                        name={`options[${index}].name.${optionLang}`}
                        value={
                          attributeForm.values.options[index].name[optionLang]
                        }
                        onChange={attributeForm.handleChange}
                      />
                    </div>
                    <div className={styles.isActiveWrapper}>
                      <span style={{marginTop:"60px"}} className="inputName">Options isActive</span>
                      <Switch
                        checked={option.isActive}
                        onChange={(checked) =>
                          attributeForm.setFieldValue(
                            `options[${index}].isActive`,
                            checked
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
                <span
                  className={styles.addOptions}
                  onClick={() => {
                    attributeForm.setFieldValue("options", [
                      ...attributeForm.values.options,
                      { name: { az: "", en: "", ru: "" }, isActive: false },
                    ]);
                  }}
                >
                  Add Option +
                </span>
              </div>
              <button type="submit" className={"saveBtn"}>
                Save
              </button>
            </form>
          </div>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={allAttributeDatas?.data}
        rowKey="id"
      />
      <ModalForDelete
        deleteFunc={deleteAttribute}
        deleteItemId={deleteAttributeId}
      />
    </div>
  );
}
