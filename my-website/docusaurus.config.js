// @ts-check

import simplePlantUML from '@akebifiky/remark-simple-plantuml';
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Lost&Found',
  tagline: 'Техническая документация MVP сервиса поиска потерянных вещей и животных',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://LizaErdakova.github.io',
  baseUrl: '/lostfound-docs/',
  organizationName: 'LizaErdakova',
  projectName: 'lostfound-docs',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  plugins: [['drawio', {}]],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',
          remarkPlugins: [simplePlantUML],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
    [
      'redocusaurus',
      {
        specs: [
          {
            id: 'lostfound',
            spec: 'api_specs/lostfound-openapi.yaml',
          },
        ],
        theme: {
          primaryColor: '#2e8555',
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Lost&Found',
        logo: {
          alt: 'Lost&Found',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Документация',
          },
          {
            to: '/docs/api/rest-api',
            label: 'API',
            position: 'left',
          },
          {
            href: 'https://github.com/LizaErdakova/lostfound-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Документация',
            items: [
              {label: 'Карточка сервиса', to: '/docs/intro'},
              {label: 'Справочник API', to: '/docs/api/rest-api'},
              {label: 'Модель данных', to: '/docs/database/data-model'},
              {label: 'ER-диаграмма', to: '/docs/database/er-diagram'},
            ],
          },
          {
            title: 'Проект',
            items: [
              {
                label: 'Репозиторий',
                href: 'https://github.com/LizaErdakova/lostfound-docs',
              },
              {
                label: 'GitHub Pages',
                href: 'https://LizaErdakova.github.io/lostfound-docs/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Lost&Found. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
