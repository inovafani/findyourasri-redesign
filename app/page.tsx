import Band from '@/components/Band';
import BrandReel from '@/components/BrandReel';
import Contact from '@/components/Contact';
import Hero from '@/components/Hero';
import SectorTiles from '@/components/SectorTiles';
import ServicesBrief from '@/components/ServicesBrief';
import Statement from '@/components/Statement';
import Work from '@/components/Work';

/**
 * The homepage carries the argument, compressed — and leans on the pictures to
 * do it. The reading-heavy parts (service checklists, the accountability
 * tables, the sector proof lines) now live on the page that owns them, so
 * nothing here is said twice.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <BrandReel />
      <Statement num="[02]" />
      <Work num="[03]" />
      <SectorTiles num="[04]" />
      <ServicesBrief num="[05]" />
      <Band />
      <Contact num="[06]" heading="h2" />
    </>
  );
}
