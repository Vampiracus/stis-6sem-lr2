"use client"
import { Entities } from '@/components/Entities'
import styles from "./page.module.css";
import { useState } from 'react'
import { Checker } from '@/components/Checker'
import { ClassType } from '@/libs/classCreator'

export default function Home() {
  const [isSchemed, setisSchemed] = useState(false);
  const [classes, setClasses] = useState<ClassType>([]);

  return (
    <main className={styles.main}>
      <section>
        <h1>
          Лаба 2 по СТИС
        </h1>
        <h3>Схема сущностей</h3>
        <Entities classes={classes} setClasses={setClasses} disabled={isSchemed}/>

        {!isSchemed ? <button onClick={e => setisSchemed(true)}>Построить схему</button> : null}
      </section>
      {isSchemed ?  <Checker classes={classes} /> : null}
    </main>
  );
}
