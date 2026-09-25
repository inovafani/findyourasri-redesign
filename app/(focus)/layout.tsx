import FocusHeader from '@/components/FocusHeader';
import SlimFooter from '@/components/SlimFooter';

/**
 * Hidden pages: one reader, one job. The focused header and the slim footer,
 * and no link anywhere on the site points here.
 */
export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="wrap">
      <FocusHeader />
      <main id="main">{children}</main>
      <SlimFooter />
    </div>
  );
}
