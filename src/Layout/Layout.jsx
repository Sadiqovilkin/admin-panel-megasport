import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";
import styles from "./Layout.module.scss"
import Header from "../Components/Header/Header";


export default function Layout() {
  return (
    <>
      <Header/>
      <div className={styles.layoutWrapper}>
        <Sidebar />
        <div className={styles.contentWrapper}>
          <Outlet />
        </div>
      </div>
    </>
  );
}
