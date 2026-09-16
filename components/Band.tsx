/** The full-width standard band that closes the archive. */
export default function Band() {
  return (
    <section className="section--tight" aria-label="Our standard" style={{ paddingTop: 'var(--gap)' }}>
      <div className="band">
        <div className="band__media parallax-media">
          <img src="/img/band-wake.jpg" alt="" width={986} height={1600} loading="lazy" />
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
