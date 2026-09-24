/** The full-width standard band that closes the archive. */
export default function Band() {
  return (
    <section className="section section--band" aria-label="Our standard">
      <div className="band">
        <div className="band__media parallax-media">
          <img src="/img/band-close.jpg" alt="" width={843} height={1500} loading="lazy" />
        </div>
        <div className="band__scrim" aria-hidden="true" />
        <div className="band__body">
          <p className="kicker reveal">[ OUR STANDARD ]</p>
          <p className="band__line line-mask">
            We would rather be judged on your numbers than on our showreel.
          </p>
        </div>
      </div>
    </section>
  );
}
