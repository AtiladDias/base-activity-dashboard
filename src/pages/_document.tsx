// src/pages/_document.tsx  (estado anterior do projeto antigo)
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Base verification */}
        <meta name="base:app_id" content="6952c55cc63ad876c9081871" />

        {/* Talent verification — Projeto antigo (Base Activity Dashboard) */}
        <meta
          name="talentapp:project_verification"
          content="70b67f54ae35646b3cc7cc06cea2dc87343e079ce99a1f63231018c87179dcc3e60e326e21b62401714d887d060a43b99f7e3755687f6e82c0829445e1369008"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
