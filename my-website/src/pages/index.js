import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const sections = [
  ['Требования', '/docs/category/требования'],
  ['API', '/docs/category/api'],
  ['Данные', '/docs/category/данные'],
  ['UML', '/docs/category/uml'],
  ['Процессы', '/docs/category/процессы'],
  ['Архитектура', '/docs/category/архитектура'],
];

export default function Home() {
  return (
    <Layout
      title="Lost&Found Docs"
      description="Техническая документация Lost&Found MVP">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className="container">
            <Heading as="h1" className={styles.title}>
              Lost&Found
            </Heading>
            <p className={styles.subtitle}>
              Техническая документация MVP сервиса поиска потерянных вещей и
              домашних животных, оформленная в формате docs as code.
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to="/docs/intro">
                Открыть документацию
              </Link>
              <Link className="button button--secondary button--lg" to="/api/lostfound">
                OpenAPI
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.sections}>
          <div className="container">
            <div className={styles.grid}>
              {sections.map(([label, to]) => (
                <Link key={to} className={styles.card} to={to}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
