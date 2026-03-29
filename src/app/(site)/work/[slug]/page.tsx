import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkBySlug, works } from "@/shared/constants/works";
import styles from "./page.module.scss";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) return {};
  return { title: work.title, description: work.description };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();

  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/work" className={styles.back}>← Back to work</Link>

        <div className={styles.intro}>
          <p className={styles.label}>{work.category} · {work.year}</p>
          <h1 className={styles.heading}>{work.title}</h1>
          <p className={styles.lead}>{work.description}</p>
          <div className={styles.tags}>
            {work.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className={styles.cover} />

        <p className={styles.note}>
          Full project documentation, process work, and deliverables are
          available on request. Get in touch if you'd like to know more.
        </p>
      </div>
    </div>
  );
}
