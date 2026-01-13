import { createContext, useContext, useState } from "react";

const GlobalContext = createContext(null);

const GlobalProvider = ({ children }) => {
  const [showHiddenAddModal, setShowHiddenAddModal] = useState(false);
  const [editForModal, setEditForModal] = useState(false);
  const [deleteForModal, setDeleteForModal] = useState(false);
  const [showHiddenModal, setShowHiddenModal] = useState(false);
  const [secondShowHiddenModal, setSecondShowHiddenModal] = useState(false);

  const closeOpenModalFunc = () => {
    setShowHiddenModal(!showHiddenModal);
  };
  const closeOpenSecondModalFunc = () => {
    setSecondShowHiddenModal(!secondShowHiddenModal);
  };

  const closeOpenAddModalFunc = () => {
    setShowHiddenAddModal(!showHiddenAddModal);
  };
  const editForModalShowHiddenFunc = () => {
    setEditForModal(!editForModal);
  };

  const deleteForModalShowHiddenFunc = () => {
    setDeleteForModal(!deleteForModal);
  };
  return (
    <GlobalContext.Provider
      value={{
        showHiddenModal,
        closeOpenModalFunc,
        showHiddenAddModal,
        closeOpenAddModalFunc,
        editForModalShowHiddenFunc,
        editForModal,
        deleteForModalShowHiddenFunc,
        deleteForModal,
        closeOpenSecondModalFunc,
        secondShowHiddenModal,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

const UseGlobalContext = () => useContext(GlobalContext);

export { GlobalProvider, UseGlobalContext };
