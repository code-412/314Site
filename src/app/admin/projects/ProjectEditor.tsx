"use client";

import { type DragEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type AdminGalleryBlock,
  type AdminProject,
  type AdminProjectBlock,
  projectCategories,
} from "@/shared/admin/mock-data";
import s from "./ProjectEditor.module.scss";

type Props = {
  initialProject: AdminProject;
  mode: "create" | "edit";
};

type ImageUploaderProps = {
  label: string;
  helper: string;
  value?: string;
  values?: string[];
  multiple?: boolean;
  onChange?: (url: string) => void;
  onChangeMany?: (urls: string[]) => void;
};

const blockLabels: Record<AdminProjectBlock["type"], string> = {
  text: "Текст",
  wide: "Большая картинка",
  gallery: "Галерея",
  dark: "Темный блок",
};

function listToText(items: string[]) {
  return items.join(", ");
}

function textToList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function makeId(type: AdminProjectBlock["type"]) {
  return `${type}-${Date.now()}`;
}

function createBlock(type: AdminProjectBlock["type"]): AdminProjectBlock {
  if (type === "text") {
    return {
      id: makeId(type),
      type,
      title: "Текстовый блок",
      heading: "",
      layout: "split",
      paragraphs: [""],
    };
  }

  if (type === "wide") {
    return {
      id: makeId(type),
      type,
      title: "Большая картинка",
      image: "",
      fullWidth: false,
      objectFit: "cover",
      background: "#f0f0f0",
    };
  }

  if (type === "gallery") {
    return {
      id: makeId(type),
      type,
      title: "Галерея",
      columns: 2,
      images: [],
    };
  }

  return {
    id: makeId(type),
    type,
    title: "Темный медиа-блок",
    heading: "",
    images: [],
  };
}

function paragraphsToText(block: AdminProjectBlock) {
  return block.type === "text" ? block.paragraphs.join("\n\n") : "";
}

export function ProjectEditor({ initialProject, mode }: Props) {
  const router = useRouter();
  const [project, setProject] = useState(initialProject);
  const [selectedId, setSelectedId] = useState(initialProject.blocks[0]?.id ?? "");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedBlock = useMemo(
    () => project.blocks.find((block) => block.id === selectedId),
    [project.blocks, selectedId]
  );

  const updateProject = <Key extends keyof AdminProject>(key: Key, value: AdminProject[Key]) => {
    setProject((current) => ({ ...current, [key]: value }));
  };

  const updateBlock = (id: string, update: Partial<AdminProjectBlock>) => {
    setProject((current) => ({
      ...current,
      blocks: current.blocks.map((block) =>
        block.id === id ? ({ ...block, ...update } as AdminProjectBlock) : block
      ),
    }));
  };

  const addBlock = (type: AdminProjectBlock["type"]) => {
    const next = createBlock(type);
    setProject((current) => ({ ...current, blocks: [...current.blocks, next] }));
    setSelectedId(next.id);
  };

  const moveBlock = (id: string, direction: -1 | 1) => {
    setProject((current) => {
      const index = current.blocks.findIndex((block) => block.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.blocks.length) return current;
      const blocks = [...current.blocks];
      const [item] = blocks.splice(index, 1);
      blocks.splice(target, 0, item);
      return { ...current, blocks };
    });
  };

  const duplicateBlock = (id: string) => {
    const block = project.blocks.find((item) => item.id === id);
    if (!block) return;
    const clone = { ...block, id: `${block.id}-copy-${Date.now()}`, title: `${block.title} copy` };
    const index = project.blocks.findIndex((item) => item.id === id);
    setProject((current) => ({
      ...current,
      blocks: [
        ...current.blocks.slice(0, index + 1),
        clone as AdminProjectBlock,
        ...current.blocks.slice(index + 1),
      ],
    }));
    setSelectedId(clone.id);
  };

  const deleteBlock = (id: string) => {
    setProject((current) => {
      const blocks = current.blocks.filter((block) => block.id !== id);
      setSelectedId(blocks[0]?.id ?? "");
      return { ...current, blocks };
    });
  };

  const saveProject = async (status: AdminProject["status"]) => {
    setSaving(true);
    setNotice("");

    try {
      const payload = { ...project, status };
      const response = await fetch(
        mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${project.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message = data?.issues?.[0]?.message || data?.error || "Не удалось сохранить проект.";
        setNotice(message);
        return;
      }

      setProject(data.project);
      setNotice(status === "published" ? "Проект опубликован." : "Черновик сохранен.");

      if (mode === "create") {
        router.replace(`/admin/projects/${data.project.id}/edit`);
      }

      router.refresh();
      window.setTimeout(() => setNotice(""), 2600);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={s.builder}>
      {notice && <div className={s.toast}>{notice}</div>}

      <section className={s.panel}>
        <div className={s.panelHead}>
          <div>
            <span className={s.eyebrow}>{mode === "create" ? "Создание" : "Редактирование"} / Шаг 1</span>
            <h2 className={s.panelTitle}>Данные проекта</h2>
            <p className={s.muted}>Это попадет в карточки, hero детальной страницы и SEO-описание.</p>
          </div>
          <div className={s.buttonRow}>
            <button type="button" className={s.buttonMuted} disabled={saving} onClick={() => saveProject("draft")}>
              {saving ? "Saving..." : "Save draft"}
            </button>
            <button type="button" className={s.buttonDark} disabled={saving} onClick={() => saveProject("published")}>
              {saving ? "Saving..." : "Publish"}
            </button>
          </div>
        </div>

        <div className={s.projectGrid}>
          <div className={s.coverColumn}>
            <ImageUploader
              label="Обложка проекта"
              helper="Перетащи картинку сюда или выбери файл. Файл сохранится в uploads и появится в превью."
              value={project.coverImage}
              onChange={(url) => updateProject("coverImage", url)}
            />
          </div>

          <div className={s.formGrid}>
            <div className={`${s.field} ${s.full}`}>
              <label htmlFor="project-title">Название проекта</label>
              <input
                id="project-title"
                className={s.input}
                placeholder="Например: MH Padel Club"
                value={project.title}
                onChange={(event) => updateProject("title", event.target.value)}
              />
            </div>
            <div className={s.field}>
              <label htmlFor="project-slug">Slug</label>
              <input
                id="project-slug"
                className={s.input}
                placeholder="mh-padel-club"
                value={project.slug}
                onChange={(event) => updateProject("slug", event.target.value)}
              />
            </div>
            <div className={s.field}>
              <label htmlFor="project-category">Категория</label>
              <select
                id="project-category"
                className={s.select}
                value={project.category}
                onChange={(event) => updateProject("category", event.target.value)}
              >
                <option value="">Выбрать категорию</option>
                {projectCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className={s.field}>
              <label htmlFor="project-client">Клиент</label>
              <input
                id="project-client"
                className={s.input}
                placeholder="Название клиента"
                value={project.client}
                onChange={(event) => updateProject("client", event.target.value)}
              />
            </div>
            <div className={s.field}>
              <label htmlFor="project-date">Дата</label>
              <input
                id="project-date"
                className={s.input}
                placeholder="05 Mar 2026"
                value={project.date}
                onChange={(event) => updateProject("date", event.target.value)}
              />
            </div>
            <div className={s.field}>
              <label htmlFor="project-year">Год</label>
              <input
                id="project-year"
                className={s.input}
                type="number"
                value={project.year}
                onChange={(event) => updateProject("year", Number(event.target.value))}
              />
            </div>
            <div className={s.field}>
              <label htmlFor="project-url">Ссылка на проект</label>
              <input
                id="project-url"
                className={s.input}
                placeholder="https://..."
                value={project.projectUrl}
                onChange={(event) => updateProject("projectUrl", event.target.value)}
              />
            </div>
            <div className={`${s.field} ${s.full}`}>
              <label htmlFor="project-description">Короткое описание</label>
              <textarea
                id="project-description"
                className={s.textarea}
                placeholder="Одно-два предложения для карточки и мета-описания."
                value={project.description}
                onChange={(event) => updateProject("description", event.target.value)}
              />
            </div>
            <div className={s.field}>
              <label htmlFor="project-tags">Теги через запятую</label>
              <input
                id="project-tags"
                className={s.input}
                placeholder="Web Design, Branding"
                value={listToText(project.tags)}
                onChange={(event) => updateProject("tags", textToList(event.target.value))}
              />
            </div>
            <div className={s.field}>
              <label htmlFor="project-services">Услуги через запятую</label>
              <input
                id="project-services"
                className={s.input}
                placeholder="Logo Design, UI / UX Design"
                value={listToText(project.services)}
                onChange={(event) => updateProject("services", textToList(event.target.value))}
              />
            </div>
            <label className={`${s.switchRow} ${s.full}`}>
              <span>
                <strong>Показывать на главной</strong>
                <span className={s.muted}> Проект попадет в featured-блок работ.</span>
              </span>
              <input
                className={s.checkbox}
                type="checkbox"
                checked={project.featured}
                onChange={(event) => updateProject("featured", event.target.checked)}
              />
            </label>
          </div>
        </div>
      </section>

      <section className={s.panel}>
        <div className={s.panelHead}>
          <div>
            <span className={s.eyebrow}>Шаг 2</span>
            <h2 className={s.panelTitle}>Конструктор страницы</h2>
            <p className={s.muted}>Добавляй блоки сверху вниз. Именно в таком порядке они появятся на странице проекта.</p>
          </div>
        </div>

        <div className={s.blockLibrary}>
          <button type="button" className={s.addButton} onClick={() => addBlock("text")}>
            <strong>Текстовый блок</strong>
            <span>Заголовок и абзацы</span>
          </button>
          <button type="button" className={s.addButton} onClick={() => addBlock("wide")}>
            <strong>Большая картинка</strong>
            <span>Один широкий визуал</span>
          </button>
          <button type="button" className={s.addButton} onClick={() => addBlock("gallery")}>
            <strong>Галерея</strong>
            <span>Несколько изображений</span>
          </button>
          <button type="button" className={s.addButton} onClick={() => addBlock("dark")}>
            <strong>Темный блок</strong>
            <span>Черная секция с медиа</span>
          </button>
        </div>

        <div className={s.blockWorkspace}>
          <div className={s.blockListPanel}>
            <div className={s.listHead}>
              <strong>Блоки страницы</strong>
              <span>{project.blocks.length}</span>
            </div>
            {project.blocks.length === 0 ? (
              <div className={s.emptyState}>
                Пока блоков нет. Нажми одну из кнопок выше, например “Текстовый блок”.
              </div>
            ) : (
              <div className={s.blockList}>
                {project.blocks.map((block, index) => (
                  <button
                    key={block.id}
                    type="button"
                    className={`${s.blockItem}${block.id === selectedId ? ` ${s.blockItemActive}` : ""}${block.hidden ? ` ${s.hidden}` : ""}`}
                    onClick={() => setSelectedId(block.id)}
                  >
                    <span className={s.blockIndex}>{index + 1}</span>
                    <span>
                      <span className={s.blockTitle}>{block.title}</span>
                      <span className={s.blockType}>{blockLabels[block.type]}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={s.blockEditorPanel}>
            {selectedBlock ? (
              <>
                <div className={s.panelHead}>
                  <div>
                    <span className={s.eyebrow}>Редактируется</span>
                    <h3 className={s.panelTitle}>{selectedBlock.title}</h3>
                    <p className={s.muted}>{blockLabels[selectedBlock.type]}</p>
                  </div>
                  <div className={s.buttonRow}>
                    <button type="button" className={s.buttonMuted} onClick={() => moveBlock(selectedBlock.id, -1)}>Вверх</button>
                    <button type="button" className={s.buttonMuted} onClick={() => moveBlock(selectedBlock.id, 1)}>Вниз</button>
                    <button type="button" className={s.buttonMuted} onClick={() => duplicateBlock(selectedBlock.id)}>Дублировать</button>
                    <button
                      type="button"
                      className={s.buttonMuted}
                      onClick={() => updateBlock(selectedBlock.id, { hidden: !selectedBlock.hidden })}
                    >
                      {selectedBlock.hidden ? "Показать" : "Скрыть"}
                    </button>
                    <button type="button" className={s.button} onClick={() => deleteBlock(selectedBlock.id)}>Удалить</button>
                  </div>
                </div>
                <BlockFields block={selectedBlock} updateBlock={updateBlock} />
              </>
            ) : (
              <div className={s.emptyState}>
                Выбери существующий блок или добавь новый. Здесь появятся его настройки.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className={s.panel}>
        <div className={s.panelHead}>
          <div>
            <span className={s.eyebrow}>Шаг 3</span>
            <h2 className={s.panelTitle}>Превью проекта</h2>
            <p className={s.muted}>Моковое превью обновляется сразу после ввода текста и загрузки картинок.</p>
          </div>
          {mode === "create" ? (
            <button type="button" className={s.buttonMuted} disabled>
              Save first
            </button>
          ) : (
            <Link href={`/admin/projects/${project.id}/preview`} className={s.buttonMuted}>
              Full preview
            </Link>
          )}
        </div>

        <div className={s.previewLayout}>
          <section className={s.heroPreview}>
            {project.coverImage ? (
              <div className={s.heroImage} style={{ backgroundImage: `url(${project.coverImage})` }} />
            ) : (
              <div className={s.heroImageEmpty}>Обложка появится здесь</div>
            )}
            <div className={s.heroBody}>
              <h2 className={s.heroTitle}>{project.title || "Название проекта"}</h2>
              <div className={s.heroMeta}>
                <span>Client<br />{project.client || "Клиент"}</span>
                <span>Type<br />{project.category || "Категория"}</span>
              </div>
              {project.tags.length > 0 && (
                <div className={s.tagRow}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={s.tag}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </section>

          <div className={s.previewStack}>
            {project.blocks.filter((block) => !block.hidden).length === 0 ? (
              <div className={s.emptyState}>Добавленные блоки появятся в превью справа от hero.</div>
            ) : (
              project.blocks.filter((block) => !block.hidden).map((block) => (
                <BlockPreview key={block.id} block={block} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function BlockFields({
  block,
  updateBlock,
}: {
  block: AdminProjectBlock;
  updateBlock: (id: string, update: Partial<AdminProjectBlock>) => void;
}) {
  return (
    <div className={s.formGrid}>
      <div className={`${s.field} ${s.full}`}>
        <label htmlFor="block-title">Название блока в админке</label>
        <input
          id="block-title"
          className={s.input}
          value={block.title}
          onChange={(event) => updateBlock(block.id, { title: event.target.value })}
        />
      </div>

      {block.type === "text" && (
        <>
          <div className={s.field}>
            <label htmlFor="block-heading">Заголовок на странице</label>
            <input
              id="block-heading"
              className={s.input}
              placeholder="Context"
              value={block.heading}
              onChange={(event) => updateBlock(block.id, { heading: event.target.value })}
            />
          </div>
          <div className={s.field}>
            <label htmlFor="block-layout">Расположение</label>
            <select
              id="block-layout"
              className={s.select}
              value={block.layout}
              onChange={(event) => updateBlock(block.id, { layout: event.target.value as "default" | "split" })}
            >
              <option value="split">Split: заголовок слева, текст справа</option>
              <option value="default">Default: заголовок над текстом</option>
            </select>
          </div>
          <div className={`${s.field} ${s.full}`}>
            <label htmlFor="block-paragraphs">Текст блока</label>
            <textarea
              id="block-paragraphs"
              className={s.textareaLarge}
              placeholder="Каждый новый абзац отделяй пустой строкой."
              value={paragraphsToText(block)}
              onChange={(event) =>
                updateBlock(block.id, {
                  paragraphs: event.target.value.split("\n\n"),
                })
              }
            />
          </div>
        </>
      )}

      {block.type === "wide" && (
        <>
          <div className={`${s.field} ${s.full}`}>
            <ImageUploader
              label="Изображение блока"
              helper="Перетащи файл или нажми кнопку. Файл сохранится в uploads и появится в превью."
              value={block.image}
              onChange={(url) => updateBlock(block.id, { image: url })}
            />
          </div>
          <div className={s.field}>
            <label htmlFor="block-fit">Обрезка изображения</label>
            <select
              id="block-fit"
              className={s.select}
              value={block.objectFit}
              onChange={(event) => updateBlock(block.id, { objectFit: event.target.value as "cover" | "contain" })}
            >
              <option value="cover">Cover: заполнить блок</option>
              <option value="contain">Contain: показать целиком</option>
            </select>
          </div>
          <div className={s.field}>
            <label htmlFor="block-bg">Фон под картинкой</label>
            <input
              id="block-bg"
              className={s.input}
              value={block.background}
              onChange={(event) => updateBlock(block.id, { background: event.target.value })}
            />
          </div>
          <label className={`${s.switchRow} ${s.full}`}>
            <span>
              <strong>На всю ширину страницы</strong>
              <span className={s.muted}> Для больших брендовых мокапов и full-width секций.</span>
            </span>
            <input
              className={s.checkbox}
              type="checkbox"
              checked={block.fullWidth}
              onChange={(event) => updateBlock(block.id, { fullWidth: event.target.checked })}
            />
          </label>
        </>
      )}

      {(block.type === "gallery" || block.type === "dark") && (
        <>
          {block.type === "gallery" && (
            <div className={s.field}>
              <label htmlFor="block-columns">Колонки</label>
              <select
                id="block-columns"
                className={s.select}
                value={block.columns}
                onChange={(event) =>
                  updateBlock(block.id, { columns: Number(event.target.value) as AdminGalleryBlock["columns"] })
                }
              >
                <option value={2}>2 колонки</option>
                <option value={3}>3 колонки</option>
              </select>
            </div>
          )}
          {block.type === "dark" && (
            <div className={s.field}>
              <label htmlFor="block-dark-heading">Заголовок темного блока</label>
              <input
                id="block-dark-heading"
                className={s.input}
                placeholder="Visual system"
                value={block.heading}
                onChange={(event) => updateBlock(block.id, { heading: event.target.value })}
              />
            </div>
          )}
          <div className={`${s.field} ${s.full}`}>
            <ImageUploader
              label="Изображения"
              helper="Можно выбрать сразу несколько файлов или перетащить пачку изображений."
              values={block.images}
              multiple
              onChangeMany={(urls) => updateBlock(block.id, { images: urls })}
            />
          </div>
        </>
      )}
    </div>
  );
}

function ImageUploader({
  label,
  helper,
  value,
  values,
  multiple,
  onChange,
  onChangeMany,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const images = values ?? (value ? [value] : []);

  const applyFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    imageFiles.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Upload failed.");
        return;
      }

      const urls = (data.files as { url: string }[]).map((file) => file.url);
      if (urls.length === 0) return;

      if (multiple) {
        onChangeMany?.([...(values ?? []), ...urls]);
      } else {
        onChange?.(urls[0]);
      }
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    void applyFiles(event.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    if (multiple) {
      onChangeMany?.((values ?? []).filter((_, itemIndex) => itemIndex !== index));
    } else {
      onChange?.("");
    }
  };

  return (
    <div className={s.uploader}>
      <div
        className={`${s.dropzone}${images.length > 0 ? ` ${s.dropzoneFilled}` : ""}`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className={s.fileInput}
          onChange={(event) => {
            if (event.target.files) void applyFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <div>
          <strong>{label}</strong>
          <span>{helper}</span>
        </div>
        <button type="button" className={s.buttonDark} disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {error && <p className={s.uploadError}>{error}</p>}

      {images.length > 0 && (
        <div className={multiple ? s.uploadGrid : s.uploadSingle}>
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className={s.uploadPreview}>
              <div className={s.uploadPreviewImage} style={{ backgroundImage: `url(${image})` }} />
              <button type="button" onClick={() => removeImage(index)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BlockPreview({ block }: { block: AdminProjectBlock }) {
  if (block.type === "text") {
    return (
      <article className={s.blockCard}>
        <div className={block.layout === "split" ? s.previewSplit : undefined}>
          <h3 className={s.previewHeading}>{block.heading || "Заголовок блока"}</h3>
          <div className={s.previewText}>
            {block.paragraphs.filter(Boolean).length === 0 ? (
              <p>Текст появится здесь.</p>
            ) : (
              block.paragraphs.filter(Boolean).map((paragraph, index) => (
                <p key={`${block.id}-${index}`}>{paragraph}</p>
              ))
            )}
          </div>
        </div>
      </article>
    );
  }

  if (block.type === "wide") {
    return (
      <article className={s.blockCard}>
        {block.image ? (
          <div
            className={s.previewImage}
            style={{
              backgroundColor: block.background,
              backgroundImage: `url(${block.image})`,
              backgroundSize: block.objectFit,
            }}
          />
        ) : (
          <div className={s.previewImageEmpty}>Картинка блока появится здесь</div>
        )}
      </article>
    );
  }

  if (block.type === "gallery") {
    return (
      <article className={s.blockCard}>
        {block.images.length === 0 ? (
          <div className={s.previewImageEmpty}>Загрузи изображения для галереи</div>
        ) : (
          <div className={s.previewGallery} data-cols={block.columns}>
            {block.images.map((image, index) => (
              <div
                key={`${block.id}-${index}`}
                className={s.previewGalleryImage}
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
          </div>
        )}
      </article>
    );
  }

  return (
    <article className={`${s.blockCard} ${s.darkPreview}`}>
      <h3 className={s.previewHeading}>{block.heading || "Заголовок темного блока"}</h3>
      {block.images.length === 0 ? (
        <div className={s.previewImageEmpty}>Загрузи изображения для темного блока</div>
      ) : (
        <div className={s.previewGallery} data-cols={block.images.length > 1 ? 2 : 1}>
          {block.images.map((image, index) => (
            <div
              key={`${block.id}-${index}`}
              className={s.previewGalleryImage}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
      )}
    </article>
  );
}
