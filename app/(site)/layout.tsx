import Footer from '@/components/Footer';
import Header from '@/components/Header';

/** Every public page: the full header, the page, the full footer. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="wrap">
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
