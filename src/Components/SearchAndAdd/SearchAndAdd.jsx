import { useState } from "react";
import styles from "./SearchAndAdd.module.scss";
import SearchIcon from "../../assets/Icons/SearchIcon";
import FilterIcon from "../../assets/Icons/FilterIcon";
import AddIcon from "../../assets/Icons/AddIcon";
import { UseGlobalContext } from "../../Context/GlobalContext";

export default function SearchAndAdd({ addBtntext, filter, addBtn, sortFunc }) {
  const { closeOpenAddModalFunc } = UseGlobalContext();
  const [showHiddenArea, setShowHiddenArea] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleFilterArea = () => {
    setShowHiddenArea(!showHiddenArea);
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };
  // console.log("inp value=", searchValue);

  return (
    <div className={styles.searchAndAddArea}>
      <label className={styles.searchInputWrapper}>
        {searchValue.length > 0 ? "" : <SearchIcon />}
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={handleSearch}
        />
      </label>
      {filter && (
        <div className={styles.filterArea}>
          <button
            onClick={() => handleFilterArea()}
            className={styles.filterBtn}
          >
            <FilterIcon /> Filter
          </button>
          {showHiddenArea && (
            <div className={styles.filterContent}>
              <span
                onClick={() =>
                  sortFunc({ sortBy: "createdAt", direction: "ASC" })
                }
                className={styles.filterType}
              >
                Yaranma tarixine gore W
              </span>
              <span
                onClick={() =>
                  sortFunc({ sortBy: "createdAt", direction: "DESC" })
                }
                className={styles.filterType}
              >
                Yaranma tarixine gore M
              </span>
              <span className={styles.filterType}>ada gore A-Z</span>
              <span className={styles.filterType}>ada gore Z-A</span>
              <span className={styles.filterType}>yasha gore W</span>
              <span className={styles.filterType}>yasha gore M</span>
            </div>
          )}
        </div>
      )}
      {addBtn && (
        <button onClick={closeOpenAddModalFunc} className={styles.addBtn}>
          <AddIcon /> {addBtntext}
        </button>
      )}
    </div>
  );
}
