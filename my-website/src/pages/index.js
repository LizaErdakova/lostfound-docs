import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const cards = [
  {
    title: 'Карточка сервиса',
    text: 'Краткий обзор Lost&Found: назначение, аудитория, возможности MVP и структура документации.',
    image: 'img/concept-overview.png',
    to: '/docs/intro',
  },
  {
    title: 'API Reference',
    text: 'Интерактивная спецификация REST API для ленты объявлений, карточки объявления и создания объявления.',
    image: 'img/diagrams/sequence.png',
    to: '/docs/api/rest-api',
  },
  {
    title: 'Модель данных',
    text: 'Сущности, связи, ER-диаграмма и выбранный подход к хранению данных Lost&Found MVP.',
    image: 'img/diagrams/er-diagram.png',
    to: '/docs/database/data-model',
  },
];

export default function Home() {
  const cardsWithImages = cards.map((card) => ({
    ...card,
    image: useBaseUrl(card.image),
  }));

  return (
    <Layout
      title="Lost&Found"
      description="Техническая документация Lost&Found MVP">
      <main>
        <section className={styles.heroBanner}>
          <div className="container">
            <Heading as="h1" className={styles.heroTitle}>
              Lost&Found
            </Heading>
            <p className={styles.heroSubtitle}>
              Техническая документация MVP сервиса поиска потерянных вещей и домашних животных
            </p>
            <div className={styles.buttons}>
              <Link className="button button--secondary button--lg" to="/docs/intro">
                Открыть документацию
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.cardsSection}>
          <div className="container">
            <div className={styles.cardsGrid}>
              {cardsWithImages.map((card) => (
                <Link className={styles.card} to={card.to} key={card.title}>
                  <div className={styles.cardImageWrap}>
                    <img className={styles.cardImage} src={card.image} alt="" />
                  </div>
                  <Heading as="h2" className={styles.cardTitle}>
                    {card.title}
                  </Heading>
                  <p className={styles.cardText}>{card.text}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
