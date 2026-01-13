import "./CustomTableTest.scss";
import { userTableBodyData, userTableHeaderData } from "../../MyDatas/Data";
import EditIcon from "../../assets/Icons/EditIcon";
import EyeIcon from "../../assets/Icons/EyeIcon";
import DeleteIcon from "../../assets/Icons/DeleteIcon";

export default function CustomTableTest() {
  return (
    <div className="table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            {userTableHeaderData.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {userTableBodyData.map((user, index) => (
            <tr key={index}>
              <td>{user.id}</td>
              <td>{user.fullName}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>{user.gender}</td>
              <td
                className={`status ${user.verified === "yes" ? "yes" : "no"}`}
              >
                {user.verified === "yes" ? "✔ Yes" : "✘ No"}
              </td>
              <td className={`status ${user.blocked === "yes" ? "yes" : "no"}`}>
                {user.blocked === "yes" ? "✔ Yes" : "✘ No"}
              </td>
              <td>{user.lastLogin}</td>
              <td>{user.createdAt}</td>
              <td className="actions">
                <a className="view">
                  <EyeIcon />
                </a>
                <span className="edit">
                  <EditIcon />
                </span>
                <span className="delete">
                  <DeleteIcon />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
