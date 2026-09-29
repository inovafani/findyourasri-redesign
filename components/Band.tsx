/** The "Our standard" band that closes About: one line, centred over the photograph. */
export default function Band() {
  return (
    <section className="section section--band" aria-label="Our standard">
      <div className="band">
        <div className="band__media parallax-media">
          <img
            src="/img/about-below.jpg"
            alt="Aerial view of a forested karst island ringed by reef and white sand"
            width={2400}
            height={1348}
            loading="lazy"
          />
        </div>
        <div className="band__scrim" aria-hidden="true" />
        <div className="band__center">
          <p className="band__line line-mask">
            Where the Aesthetic and Numbers Come Together to Tell Your Story and
            Grow Your Business.
          </p>
        </div>
      </div>
    </section>
  );
}
