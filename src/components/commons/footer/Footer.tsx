import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <section className={styles.footer}>
      <div className={styles.footerContent}>
        <img src="/imgs/vector-libro-total-prisma.svg" alt="logo" />
        <p>
          COPYRIGHT 2025 © LA CASA DEL LIBRO TOTAL | CREADO POR <br />
          SISTEMAS Y COMPUTADORES S.A.
        </p>
      </div>
    </section>
  );
};

export default Footer;
