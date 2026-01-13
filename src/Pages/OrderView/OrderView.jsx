import { useEffect, useState } from "react";
import styles from "./OrderView.module.scss";
import { useParams } from "react-router-dom";
import megaSportAdminPanel from "../../Helpers/Helpers";
import url from "../../ApiUrls/Url";
import moment from "moment";

export default function OrderView() {
  const [orderData, setOrderData] = useState({});
  const { id } = useParams();
  //  let statusList = [
  //    "pending",
  //    "paid",
  //    "payment_failed",
  //    "confirmed",
  //    "shipped",
  //    "delivered",
  //    "cancelled",
  //    "returned",
  //  ];
    
    const getViewData = async (ProductId) => {
        try {
            const resData = await megaSportAdminPanel.api().get(url.orderView(ProductId))
              setOrderData(resData.data)
        } catch (error) {
           console.log(error);
        }
    }

    useEffect(() => {
      getViewData(id)    
    }, [id])
    
    console.log("order data ---= ", orderData);
    
  return (
    <div className={styles.orderViewPage}>
      <div className={styles.orderContent}>
        <h4 className={styles.theOrderer}>
          Sifariş :
          {`${orderData?.receiverInfo?.firstName} 
                    ${orderData?.receiverInfo?.lastName}`}
        </h4>
        <hr className={styles.line} />
        <div className={styles.customerAndReceiverInfo}>
          <div className={styles.customer}>
            <h5 className={styles.title}>Sifarişi verən</h5>
            {orderData.customer ? (
              <ul className={styles.content}>
                <li className={styles.list}>
                  {`${orderData?.customer?.firstName}
                   ${orderData?.customer?.lastName}`}
                </li>
                <li className={styles.list}>
                  Sifarişkinin cinsiyyəti : {orderData?.customer?.gender}
                </li>
                <li className={styles.list}>
                  Sifarişçinin doğum tarixi :{" "}
                  {moment(orderData?.customer?.birthdate).format("DD-MM-YYYY")}
                </li>

                <li className={styles.list}>{orderData?.customer?.phone}</li>
                <li className={styles.list}>{orderData?.customer?.email}</li>
              </ul>
            ) : (
              <span className={styles.noRegisterOrder}>
                Qeydiyyatsız sifariş
              </span>
            )}
          </div>
          <div className={styles.receiverInfo}>
            <h5 className={styles.title}>Sifarişi qəbul edən</h5>
            <ul className={styles.content}>
              <li className={styles.list}>
                {`${orderData?.receiverInfo?.firstName}
                   ${orderData?.receiverInfo?.lastName}`}
              </li>
              <li className={styles.list}>{orderData?.receiverInfo?.city}</li>
              <li className={styles.list}>
                {orderData?.receiverInfo?.fullAddress}
              </li>
              <li className={styles.list}>{orderData?.receiverInfo?.phone}</li>
              <li className={styles.list}>{orderData?.receiverInfo?.email}</li>
            </ul>
          </div>
        </div>
        <div className={styles.orders}>
          <h5 className={styles.title}>Sifarişilər</h5>
          <div className={styles.orderTable}>
            <div className={styles.tableHeader}>
              <span className={styles.orderNumber}>sir</span>
              <span className={styles.orderImage}>Şəkili</span>
              <span className={styles.orderName}>Adı</span>
              <span className={styles.orderSize}>Ölçü</span>
              <span className={styles.orderCount}>Say</span>
              <span className={styles.orderDiscount}>Endirim</span>
              <span className={styles.orderPrice}>Qiymət</span>
            </div>
            <hr className={styles.line} />
            <div className={styles.tableBody}>
              {orderData?.products?.map((order, index) => (
                <div key={index} className={styles.order}>
                  <span className={styles.orderNumber}>{index + 1}</span>
                  <span className={styles.orderImageBody}>
                    <img src={order?.image} alt="" />
                  </span>
                  <span className={styles.orderName}>
                    {order?.productTitle}
                  </span>
                  <span className={styles.orderSize}>
                    {order?.selectedOption?.value}
                  </span>
                  <span className={styles.orderCount}>{order?.quantity}</span>
                  <span className={styles.orderDiscount}>
                    {order?.selectedOption?.discountedPrice}
                  </span>
                  <span className={styles.orderPrice}>
                    {order?.selectedOption?.price} Azn
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.ordersTotal}>
          <h5 className={styles.title}>Sifarişi məbləği</h5>
          <ul className={styles.totalContent}>
            <li className={styles.list}>Toplam məbləğ - 55 Azn</li>
            <li className={styles.list}>Endirim - 15 Azn</li>
            <li className={styles.list}>Ödənilən məbləğ - 40 Azn</li>
          </ul>
        </div>
        <div className={styles.noteArea}>
          <h5 className={styles.title}>Sifarişçinin qeydi</h5>
          <textarea
            value={orderData?.note}
            className={styles.description}
            rows={3}
            disabled
          ></textarea>
        </div>
        <div className={styles.orderStatusArea}>
          {/* {statusList.map((status, index) => (
            <span className={`${styles.btnOrderStatus} ${}`} key={index}>{status.toUpperCase()}</span>
          ))} */}
          <span className={`${styles.btnOrderStatus} ${styles.pending}`}>
            pending
          </span>
          <span className={`${styles.btnOrderStatus} ${styles.paid}`}>
            paid
          </span>
          <span className={`${styles.btnOrderStatus} ${styles.payment_failed}`}>
            payment_failed
          </span>
          <span className={`${styles.btnOrderStatus} ${styles.confirmed}`}>
            confirmed
          </span>
          <span className={`${styles.btnOrderStatus} ${styles.shipped}`}>
            shipped
          </span>
          <span className={`${styles.btnOrderStatus} ${styles.delivered}`}>
            delivered
          </span>
          <span className={`${styles.btnOrderStatus} ${styles.cancelled}`}>
            cancelled
          </span>
          <span className={`${styles.btnOrderStatus} ${styles.returned}`}>
            returned
          </span>
        </div>
      </div>
    </div>
  );
}
