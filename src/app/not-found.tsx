import Link from "next/link";
import s from "./not-found.module.scss";

export default function NotFound() {
  return (
    <div className={s.page}>
      <div className={s.content}>
        <Link href="/" className={s.logo}>&lt;/&gt; 314</Link>
        <h1 className={s.code}>404</h1>
        <Link href="/" className={s.btn}>← Go Home</Link>
      </div>
    </div>
  );
}
