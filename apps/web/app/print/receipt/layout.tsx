import styles from "./index.module.css";

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={styles.wrapper}>
      <body className={`${styles.wrapper} overflow-y-auto bg-white`}>
        {children}
      </body>
    </html>
  );
}
