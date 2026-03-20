// src/pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="base:app_id" content="6952c55cc63ad876c9081871" />

        {/* 🔵 Deixe apenas esta meta temporariamente */}
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
