import type { Metadata } from "next";
import { services } from "@/shared/constants/services";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Services",
  description: "Brand identity, web design, print and motion.",
};

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.intro}>
          <p className={styles.label}>Services</p>
          <h1 className={styles.heading}>What we offer</h1>
          <p className={styles.lead}>
            Four areas of work, done properly. Scope varies by project — most
            clients mix and match depending on where they are in the process.
          </p>
        </div>

        <div className={styles.list}>
          {services.map((service, i) => (
            <div key={service.id} className={styles.item}>
              <div className={styles.itemLeft}>
                <span className={styles.num}>0{i + 1}</span>
                <h2 className={styles.title}>{service.title}</h2>
              </div>
              <div className={styles.itemRight}>
                <p className={styles.desc}>{service.description}</p>
                <ul className={styles.features}>
                  {service.features.map((f) => (
                    <li key={f} className={styles.feature}>
                      <span className={styles.dot} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
