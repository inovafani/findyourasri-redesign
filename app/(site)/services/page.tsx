import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumbs from "@/components/Breadcrumbs";
import CtaLine from "@/components/CtaLine";
import JsonLd from "@/components/JsonLd";
import CenteredHead from "@/components/CenteredHead";
import Process from "@/components/Process";
import ServiceCards from "@/components/ServiceCards";
import Stages from "@/components/Stages";
import { liveServices, partnerships, price } from "@/lib/content";
import { orgId, pageMetadata, pages, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(pages.services);

/**
 * How Asri is bought: a partnership that runs everything as one engine, in two
 * sizes, or single services.
 */
export default function ServicesPage() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/services/", label: "Services" }]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: pages.services.title,
          url: `${site.url}/services/`,
          isPartOf: { "@id": `${site.url}/#website` },
          mainEntity: {
            "@type": "OfferCatalog",
            name: "Services and partnerships",
            itemListElement: [
              ...partnerships.map((p) => ({
                "@type": "Offer",
                name: `${p.name} partnership`,
                description: p.line,
                offeredBy: { "@id": orgId },
              })),
              ...liveServices.map((s) => ({
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: s.name,
                  url: `${site.url}/services/${s.slug}/`,
                },
                offeredBy: { "@id": orgId },
              })),
            ],
          },
        }}
      />

      <section className="section section--first">
        <CenteredHead
          pattern="ripples"
          title="Every Service Feeds the Next"
          lede="Take these together as a partnership, or on their own."
        />
      </section>
      <section className="section section--tight">
        <Stages center />
      </section>

      <section id="partnerships" className="section section--anchor">
        <div className="stack stack--head">
          <h2 className="sec-title line-mask">Two Ways to Run the Chain</h2>
          <p className="text reveal">
            Run separately, these are line items. Run together, they are one
            engine, and we answer for all of it.
          </p>
        </div>

        <div className="plans">
          {partnerships.map((p) => (
            <article key={p.slug} className="card plan reveal">
              <h3 className="plan__name">{p.name}</h3>
              <p className="text">{p.line}</p>
              <ul className="ticks">
                {p.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="terms">
                <span>{p.term}</span>
                <span>{price(p.price)}</span>
              </p>
              <p>
                <Link
                  href="/contact/"
                  className="pill pill--ink magnetic"
                  data-track="cta_click"
                  data-cta-location="services_index"
                >
                  Start a conversation
                  <span className="pill__arrow" aria-hidden="true">
                    &#8599;
                  </span>
                </Link>
              </p>
            </article>
          ))}
        </div>
      </section>

      <Process />

      {/* The bundle line. Its figures and the saving are computed from PRICING
          and join the sentence once D2 applies the rate card. */}

      <section className="section">
        <h2 className="sec-title sec-title--gap line-mask">
          Or One Service at a Time
        </h2>
        <ServiceCards
          items={liveServices.map((s) => ({ slug: s.slug }))}
          showTerms
          auto
        />
      </section>

      <CtaLine
        location="services_index"
        line="Send us the number that matters, and we will scope it."
        label="Tell us what needs to move"
      />
    </>
  );
}
