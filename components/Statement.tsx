import Counter from "@/components/Counter";

/**
 * 02 · who we are. The lead paragraph is the page's one scrubbed moment: its
 * words resolve from muted to ink as the section crosses the viewport, so the
 * sentence is literally read into focus.
 */
export default function Statement({ num }: { num?: string }) {
  return (
    <section className="section">
      <div className="eyebrow" style={{ marginBottom: 20 }}>
        {num ? <span className="eyebrow__num reveal">{num}</span> : null}
        <span className="eyebrow__label reveal">Who we are</span>
      </div>

      <p className="statement__lead read-through">
        <span className="lit">A decade of marketing.</span> A decade of running
        the places <span className="lit">the marketing is meant to sell.</span>
      </p>

      <div className="statement__grid">
        <div className="card stat-card reveal">
          <p className="stat-card__body">
            We have stood on the other side of the counter. We know which nights
            need filling, which margins matter, and which piece of content
            actually moves a booking rather than just collecting likes.
          </p>
          <div>
            <p className="stat-card__label">Years in the room</p>
            <p className="stat-card__figure">
              <Counter value={10} suffix="+" />
            </p>
          </div>
        </div>

        <div className="card card--dark quote-card reveal">
          <p className="quote-card__body">
            Most agencies pitching you have never had to fill a Tuesday. We
            have.
          </p>
          <div className="quote-card__foot">
            <p className="quote-card__note">
              Operator instinct, agency machinery.
            </p>
          </div>
        </div>

        <div className="card strip-card reveal">
          <p className="stat-card__body">
            Between us we have run the floor in luxury hospitality, shot for
            Corona, Canon, DJI and National Geographic, and spent a decade
            running a full-service marketing agency: performance media, search,
            and the sites and funnels underneath them.
          </p>
          <div className="strip-card__media">
            <img
              src="/img/w-deck.jpg"
              alt="A long table laid for dinner on an open deck"
              width={1200}
              height={1125}
              loading="lazy"
            />
          </div>
        </div>

        <div className="photo-card reveal">
          <div className="photo-card__media parallax-media">
            <img
              src="/img/band-wake.jpg"
              alt="A wake trailing behind a boat on open water"
              width={986}
              height={1600}
              loading="lazy"
            />
          </div>
          <div className="photo-card__scrim" aria-hidden="true" />
          <div className="photo-card__body">
            <div>
              <p className="photo-card__figure">
                <Counter value={300} suffix="+" />
              </p>
              <p className="photo-card__note">
                Locations worked on the ground. Built to grow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
