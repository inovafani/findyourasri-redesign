/** The "Our standard" band that closes About: one line, centred over the photograph. */
export default function Band() {
  return (
    <section className="section section--band" aria-label="Our standard">
      <div className="band">
        <div className="band__media parallax-media">
          <img
            src="/img/drive/karst-bay.jpg"
            alt="A phinisi in a still bay ringed by forested karst islands"
            width={2400}
            height={1174}
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
