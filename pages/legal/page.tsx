import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { LEGAL_DOCS, LAST_UPDATED } from './content';

export default function LegalPage({ doc }: { doc: keyof typeof LEGAL_DOCS }) {
  const d = LEGAL_DOCS[doc];

  useEffect(() => {
    document.title = `${d.title} | GlowKraftee`;
    window.scrollTo({ top: 0 });
  }, [d.title]);

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      <main className="w-full max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <nav className="text-xs text-foreground-500 mb-6">
          <Link to="/" className="hover:text-accent-700">Home</Link> / <span>{d.title}</span>
        </nav>
        <h1 className="font-heading text-3xl md:text-4xl text-foreground-950 mb-2">{d.title}</h1>
        <p className="text-xs text-foreground-500 mb-8">Last updated: {LAST_UPDATED}</p>
        <div className="text-foreground-700 leading-relaxed space-y-8">
          <p>{d.intro}</p>
          {d.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-lg font-semibold text-foreground-900 mb-2">{s.heading}</h2>
              <div className="space-y-2">{s.body}</div>
            </section>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-foreground-200 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {Object.values(LEGAL_DOCS).map((o) => (
            <Link key={o.path} to={o.path} className="text-accent-700 underline underline-offset-4">
              {o.title}
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
