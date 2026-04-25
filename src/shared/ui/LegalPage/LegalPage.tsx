import s from "./LegalPage.module.scss";

type Block =
  | { type: "p"; content: React.ReactNode }
  | { type: "ul"; items: React.ReactNode[] };

type Section = {
  title?: string;
  blocks: Block[];
};

type Props = {
  title: string;
  lastUpdated?: string;
  sections: Section[];
};

export function LegalPage({ title, lastUpdated, sections }: Props) {
  return (
    <div className={s.page}>
      <div className={`${s.inner} container`}>
        <h1 className={s.title}>{title}</h1>
        {lastUpdated && (
          <p className={s.meta}>Last updated: {lastUpdated}</p>
        )}
        <div className={s.body}>
          {sections.map((section, i) => (
            <div key={i} className={s.section}>
              {section.title && (
                <p className={s.sectionTitle}>{section.title}</p>
              )}
              {section.blocks.map((block, j) =>
                block.type === "ul" ? (
                  <ul key={j} className={s.list}>
                    {block.items.map((item, k) => (
                      <li key={k}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={j} className={s.text}>{block.content}</p>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
