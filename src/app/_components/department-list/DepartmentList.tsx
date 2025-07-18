import React from "react";
import DepartmentItem from "../department-item/DepartmentItem";
import styles from "./DepartmentList.module.scss";

const departments = [
  {
    id: 1,
    name: "Santander",
    idParametro: 127,
    id_client_sci: 910,
    id_client_iuva: 1,
  },
  {
    id: 2,
    name: "Guajira",
    idParametro: 132,
    id_client_sci: 914,
    id_client_iuva: 20,
  },
];

export default function DepartmentList() {
  return (
    <div className={styles.departmentListContainer}>
      {departments.map((department) => (
        <DepartmentItem key={department.id} {...department} />
      ))}
    </div>
  );
}
