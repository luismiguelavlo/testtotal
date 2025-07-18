import DepartmentList from "../_components/department-list/DepartmentList";
import styles from "../page.module.scss";

export default function Home() {
  return (
    <>
      <p className={styles.paragraphDepartments}>
        Selecciona el departamento donde deseas realizar tus trámite
      </p>
      <DepartmentList />
    </>
  );
}
