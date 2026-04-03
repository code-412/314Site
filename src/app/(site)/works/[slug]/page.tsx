import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getWorkBySlug, works } from "@/shared/constants/works";
import { ProjectAnimations } from "./ProjectAnimations";
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

  const aboutParagraphs   = work.about?.split("\n\n")    ?? [];
  const approachParagraphs = work.approach?.split("\n\n") ?? [];

  return (
    <div className={styles.page}>
      <ProjectAnimations />

      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src={work.image}
            alt=""
            fill
            aria-hidden="true"
            className={styles.heroBgImg}
            data-hero-bg
            priority
          />
        </div>
        <div className={styles.heroScrim} />

        <div className={`${styles.heroInner} container`}>
          <h1 className={styles.heroTitle}>{work.title}</h1>

          <div className={styles.heroRight}>
            <Image
              src={work.image}
              alt={work.title}
              fill
              sizes="(max-width: 900px) 100vw, 62vw"
              className={styles.heroImage}
              priority
            />
            <div className={styles.heroOverlay} />
          </div>

          <div data-hero-text className={styles.heroTextGroup}>
            <div className={styles.meta}>
              <div className={styles.metaCol}>
                <div className={styles.metaGroup}>
                  <span className={styles.metaLabel}>Client</span>
                  <span className={styles.metaValue}>{work.client ?? "—"}</span>
                </div>
                <div className={styles.metaGroup}>
                  <span className={styles.metaLabel}>Date</span>
                  <span className={styles.metaValue}>{work.date ?? work.year}</span>
                </div>
              </div>

              <div className={styles.metaCol}>
                <span className={styles.metaLabel}>Type of works</span>
                <ul className={styles.servicesList}>
                  {(work.services ?? work.tags).map((item) => (
                    <li key={item} className={styles.servicesItem}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {work.projectUrl ? (
              <a
                href={work.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cta}
              >
                See project →
              </a>
            ) : (
              <span className={styles.cta}>See project →</span>
            )}
          </div>
        </div>
      </section>

      {work.about && (
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle} data-reveal="title">About project</h2>
            <div className={styles.textBlock}>
              {aboutParagraphs.map((p, i) => (
                <p
                  key={i}
                  className={styles.paragraph}
                  data-reveal
                  style={{ "--delay": `${i * 0.1}s` } as React.CSSProperties}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {work.gallery && work.gallery.length > 0 && (
        <section className={styles.gallery}>
          <div className="container">
            <div className={styles.galleryGrid}>
              {work.gallery.slice(0, 4).map((src, i) => (
                <div
                  key={i}
                  className={styles.galleryItem}
                  data-reveal="image"
                  style={{ "--delay": `${i * 0.1}s` } as React.CSSProperties}
                >
                  <div className={styles.galleryParallax} data-parallax="0.07">
                    <Image
                      src={src}
                      alt={`${work.title} — ${i + 1}`}
                      fill
                      sizes="(max-width: 900px) 50vw, 50vw"
                      className={styles.galleryImg}
                    />
                  </div>
                </div>
              ))}
            </div>

            {work.gallery.length > 4 && (
              <div className={styles.galleryGridThree}>
                {work.gallery.slice(4).map((src, i) => (
                  <div
                    key={i}
                    className={styles.galleryItemThree}
                    data-reveal="image"
                    style={{ "--delay": `${i * 0.1}s` } as React.CSSProperties}
                  >
                    <div className={styles.galleryParallax} data-parallax="0.07">
                      <Image
                        src={src}
                        alt={`${work.title} — ${i + 5}`}
                        fill
                        sizes="(max-width: 900px) 50vw, 33vw"
                        className={styles.galleryImg}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {work.approach && (
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle} data-reveal="title">Our approach</h2>
            <div className={styles.textBlock}>
              {approachParagraphs.map((p, i) => (
                <p
                  key={i}
                  className={styles.paragraph}
                  data-reveal
                  style={{ "--delay": `${i * 0.1}s` } as React.CSSProperties}
                >
                  {p}
                </p>
              ))}
            </div>

            {work.approachImage && (
              <div className={styles.wideImage} data-reveal="image">
                <div className={styles.wideParallax} data-parallax="0.12">
                  <Image
                    src={work.approachImage}
                    alt={`${work.title} — full view`}
                    fill
                    sizes="(max-width: 900px) 100vw, 1320px"
                    className={styles.wideImg}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
