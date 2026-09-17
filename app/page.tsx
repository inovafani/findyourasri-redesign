import Band from '@/components/Band';
import BrandReel from '@/components/BrandReel';
import Contact from '@/components/Contact';
import Hero from '@/components/Hero';
import Measure from '@/components/Measure';
import Process from '@/components/Process';
import Sectors from '@/components/Sectors';
import Services from '@/components/Services';
import Statement from '@/components/Statement';
import Work from '@/components/Work';

export default function Home() {
  return (
    <>
      <Hero />
      <BrandReel />
      <Statement />
      <Work />
      <Sectors />
      <Services />
      <Band />
      <Process />
      <Measure />
      <Contact />
    </>
  );
}
