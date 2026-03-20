// src/pages/_document.tsx
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

        {/* Talent verification — Projeto novo (BA Dashboard — Stacks Edition) */}
        <meta
          name="talentapp:project_verification"
          content="5bf7fbea651372e8c478b04d58556b87a24028409fa10b7c417089141785a46c73a419bbacc242da383d83a1b520d442efe3dc0872e71851de5682030aeb378a"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
