import { useState } from "react";
import styles from "./Orders.module.scss";
import SearchIcon from "../../assets/Icons/SearchIcon";
import { Table } from "antd";
import moment from "moment";
import EyeIcon from "../../assets/Icons/EyeIcon";
import megaSportAdminPanel from "../../Helpers/Helpers";
import url from "../../ApiUrls/Url";
import { NavLink } from "react-router-dom";
import Pagination from "../../Components/Pagination/Pagination";

export default function Orders() {
  const [allOrdersData, setAllOrdersData] = useState([]);

  const statusColors = {
    pending: "#FFA500",
    paid: "#4CAF50",
    payment_failed: "#F44336",
    confirmed: "#2E7D32",
    shipped: "#1976D2",
    delivered: "#2E8B57",
    cancelled: "#9E9E9E",
    returned: "#9C27B0",
  };

  const [searchValue, setSearchValue] = useState("");
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const getAllOrdersData = async (page=1) => {
    try {
      const resData = await megaSportAdminPanel
        .api()
        .get(`${url.orderAllData}?page=${page}&perPage=15`);
      setAllOrdersData(resData.data);
    } catch (error) {
      console.log(error);
    }
  };

  const orderColumns = [
    {
      title: "#Id",
      dataIndex: "counterId",
      key: "counterId",
      width: 60,
    },
    {
      title: " Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAtString) => {
        return createdAtString
          ? moment(createdAtString).format("DD-MM-YYYY")
          : "-";
      },
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "Customer",
      render: (_, record)  => {
        const customerData = record.customer || record.receiverInfo;
        if (!customerData) return "-";
        return `${customerData.firstName} ${customerData.lastName} ...`;
      },
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
      title: "Payment",
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        const statusBgColor = statusColors[status];
        return <span className={styles.tableStatus} style={{backgroundColor:statusBgColor}}>{status}</span>
      }
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div className="icon-list">
          <NavLink to={`/orders/view/${record.id}`}>
            <EyeIcon />
          </NavLink>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.ordersPage}>
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
      </div>

      <Table
        columns={orderColumns}
        dataSource={allOrdersData.data}
        rowKey="id"
      />
           <Pagination
              func={getAllOrdersData}
              pageCountApi={allOrdersData?.meta?.totalPages}
            />
    </div>
  );
}
