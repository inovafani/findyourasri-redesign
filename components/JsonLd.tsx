/** One JSON-LD block. Server-rendered, so crawlers read it without running JS. */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
