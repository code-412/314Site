"use client";

import { useState } from "react";
import type { ContactFormData } from "@/shared/types";
import styles from "./page.module.scss";

const BUDGETS = ["< $1k", "$1k – $3k", "$3k – $8k", "$8k+", "Let's talk"];

const empty: ContactFormData = { name: "", email: "", budget: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>(empty);
  const [sent, setSent] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form:", form);
    setSent(true);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.info}>
            <p className={styles.label}>Contact</p>
            <h1 className={styles.heading}>Let's talk</h1>
            <p className={styles.lead}>
              Whether you have a clear brief or just an idea — reach out.
              We'll figure out the scope together.
            </p>
            <div className={styles.details}>
              <p><strong>Email:</strong> hello@314.studio</p>
              <p><strong>Response time:</strong> Usually within 24 hours</p>
            </div>
          </div>

          <div className={styles.formWrap}>
            {sent ? (
              <div className={styles.thanks}>
                <p className={styles.thanksTitle}>Got it.</p>
                <p className={styles.thanksText}>
                  Thanks for reaching out. I'll get back to you within a day or two.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.fieldLabel}>Name</label>
                  <input id="name" name="name" className={styles.input} placeholder="Your name" value={form.name} onChange={onChange} required />
                </div>

                <div className={styles.field}>
                  <label htmlFor="email" className={styles.fieldLabel}>Email</label>
                  <input id="email" name="email" type="email" className={styles.input} placeholder="you@example.com" value={form.email} onChange={onChange} required />
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Budget range</span>
                  <div className={styles.budgets}>
                    {BUDGETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, budget: b }))}
                        className={`${styles.budgetBtn}${form.budget === b ? ` ${styles["budgetBtn--active"]}` : ""}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="message" className={styles.fieldLabel}>Message</label>
                  <textarea id="message" name="message" className={styles.textarea} rows={5} placeholder="What are you working on?" value={form.message} onChange={onChange} required />
                </div>

                <button type="submit" className={styles.submit}>Send message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
