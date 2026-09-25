/** What a sector asks to be measured on: the heading with its lede under it on the left, the list on the right. Left out where nothing is on record (W7). */
export default function Measured({ items }: { items?: readonly string[] }) {
  if (!items?.length) return null;

  return (
    <section className="section">
      <div className="split split--top">
        <div className="stack">
          <h2 className="sec-title line-mask">What We Ask to Be Measured On</h2>
          <p className="text reveal">We agree your numbers in month one and report monthly.</p>
        </div>
        <div className="stack">
          <ul className="mlist">
            {items.map((item) => (
              <li key={item} className="reveal">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
