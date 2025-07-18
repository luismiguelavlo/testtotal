"use client";
import { useDispatch } from "react-redux";
import styles from "./DepartmentItem.module.scss";
import { setParameters } from "@/store/validities/validitySlice";
import { useRouter } from "next/navigation";

interface DepartmentItemProps {
  name: string;
  id_client_sci: number; //se usa para pagar trámites
  id_client_iuva: number; //se usa para buscar deuda
  idParametro: number;
}

export default function DepartmentItem({
  name,
  id_client_sci,
  id_client_iuva,
  idParametro,
}: DepartmentItemProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClick = () => {
    dispatch(
      setParameters({
        idParametro,
        idClientIuva: id_client_iuva,
        idClientSci: id_client_sci,
        departmentName: name,
      })
    );
    router.push(
      `/searcher-validities?departmentName=${encodeURIComponent(
        name.toLocaleLowerCase()
      )}`
    );
  };

  return (
    <div
      className={styles.departmentItemContainer}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <span>{name}</span>
      <button className={styles.buttonArrow}>
        <i className="pi pi-chevron-right"></i>
      </button>
    </div>
  );
}
