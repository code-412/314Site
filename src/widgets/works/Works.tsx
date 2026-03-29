import Link from "next/link";
import s from "./Works.module.scss";

export function Works() {
  return (
    <section className={s.works} id="works">
      <div className="container">
        <h2 className={s.heading}>OUR WORKS</h2>

        <div className={s.card}>
          <img src="/backgrounImage.png" alt="MH Padel Club" className={s.cardBg} />
          <div className={s.cardOverlay} />

          <div className={s.cardHeader}>
            <span className={s.tag}>WEB-MIND</span>
            <span className={s.tag}>FULL STACK</span>
            <span className={s.tag}>BRAND DESIGN</span>
          </div>

          <div className={s.cardBody}>
            <h3 className={s.cardTitle}>WEBSITE FOR MH PADEL CLUB</h3>
          </div>
        </div>

        <div className={s.exploreWrap}>
          <Link href="/work" className={s.exploreBtn}>
            <span>Explore More Projects &gt;&gt;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
