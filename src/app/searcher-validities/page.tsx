import styles from "../page.module.scss";
import SearcherVehicles from "../_components/searcher-vehicles/SearcherVehicles";
import SearcherContentCard from "../_components/searcher-content-card/SearcherContentCard";
import SearcherFooter from "../_components/searcher-footer/SearcherFooter";

export default function SearcherValidities() {
  console.log("server", process.env.UAPI);
  console.log("server", process.env.PAPI);
  console.log("server", process.env);
  return (
    <div className={styles.pageContainer}>
      <section className={styles.searcherVehiclesContainer}>
        <SearcherVehicles
          username={process.env.UAPI || ""}
          password={process.env.PAPI || ""}
        />
      </section>
      <section className={styles.searcherContentCardContainer}>
        <SearcherContentCard />
      </section>
      <section className={styles.searcherFooterContainer}>
        <SearcherFooter />
      </section>
    </div>
  );
}
