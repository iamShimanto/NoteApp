import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";

export default function SeoDefaults() {
  const location = useLocation();
  const canonical =
    typeof window !== "undefined"
      ? `${window.location.origin}${location.pathname}`
      : undefined;

  const siteOrigin =
    typeof window !== "undefined" ? window.location.origin : "";
  const ogImage = siteOrigin ? `${siteOrigin}/icon.webp` : "/icon.webp";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NoteStack",
    url: siteOrigin || undefined,
  };

  return (
    <Helmet defaultTitle="NoteStack" titleTemplate="%s • NoteStack">
      {canonical ? <link rel="canonical" href={canonical} /> : null}

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <meta
        name="description"
        content="Create and manage secure notes with tags and completion tracking."
      />
      <meta
        name="keywords"
        content="notes app, secure notes, note taking, tags, todo notes, personal notes"
      />
      <meta name="robots" content="index,follow" />
      <meta name="theme-color" content="#020617" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="NoteStack" />
      <meta property="og:title" content="NoteStack" />
      <meta
        property="og:description"
        content="Create and manage secure notes with tags and completion tracking."
      />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="NoteStack" />
      <meta
        name="twitter:description"
        content="Create and manage secure notes with tags and completion tracking."
      />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
