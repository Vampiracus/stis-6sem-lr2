import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>
        Лаба 2 по СТИС
      </h1>
      <button>Построить схему</button>
    </main>
  );
}
