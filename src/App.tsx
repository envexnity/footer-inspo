import React, { useEffect, useState } from 'react';
import { CustomizerDrawer } from './components/CustomizerDrawer';
import { DarkroomFooter } from './components/DarkroomFooter';
import { ActiveModal, FooterModals } from './components/FooterModals';
import { FOOTER_COLUMNS, FooterLinkItem, SAFELIGHT_PRESETS, SafelightPreset } from './data/footerData';

export default function App() {
  const [presetIndex, setPresetIndex] = useState(0);
  const [wordmark, setWordmark] = useState('DARKROOM');
  const [brandName, setBrandName] = useState('DARKROOM.ENGINEERING');
  const [lineCount, setLineCount] = useState(26);
  const [animated, setAnimated] = useState(true);
  const [showBackgroundLines, setShowBackgroundLines] = useState(true);

  const [modal, setModal] = useState<ActiveModal>({ type: 'none' });
  const [customizerOpen, setCustomizerOpen] = useState(false);

  const preset: SafelightPreset = SAFELIGHT_PRESETS[presetIndex] ?? SAFELIGHT_PRESETS[0];

  // Sync theme CSS custom properties with active safelight preset
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--dr-bg', preset.bg);
    root.style.setProperty('--dr-accent', preset.accent);
    root.style.setProperty('--dr-accent-muted', preset.accentMuted);
    root.style.setProperty('--dr-surface', preset.surface);
    root.style.setProperty('--dr-surface-hover', preset.surfaceHover);
    root.style.setProperty('--dr-line', preset.line);
    root.style.setProperty('--dr-line-strong', preset.lineStrong);
    root.style.setProperty('--dr-cta-text', preset.ctaText);
  }, [preset]);

  const handleCyclePreset = () => {
    setPresetIndex((prev) => (prev + 1) % SAFELIGHT_PRESETS.length);
  };

  const handleCycleDensity = () => {
    setLineCount((prev) => (prev === 22 ? 26 : prev === 26 ? 32 : 22));
  };

  const handleSelectLink = (item: FooterLinkItem) => {
    if (item.label === 'CONTACT') {
      setModal({ type: 'contact' });
      return;
    }
    if (item.label === 'ALL OSS PROJECTS') {
      setModal({ type: 'sponsor' });
      return;
    }
    setModal({ type: 'link', item });
  };

  const navLinks = FOOTER_COLUMNS[0].links;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--dr-bg)] text-[var(--dr-accent)] font-mono">
      {/* Minimal 3-Zone Top Bar */}
      <header className="h-[44px] px-3 sm:px-4 border-b border-[var(--dr-line)] flex items-center justify-between gap-8">
        <a
          href="#darkroom-footer"
          className="text-xs font-medium tracking-[0.06em] uppercase whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dr-accent)]"
        >
          {brandName || 'DARKROOM.ENGINEERING'}
        </a>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-6 text-[11px] tracking-[0.05em] uppercase text-[var(--dr-accent-muted)]"
        >
          {navLinks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleSelectLink(item)}
              className="hover:text-[var(--dr-accent)] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dr-accent)]"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setCustomizerOpen(true)}
            className="px-3 py-1.5 bg-[var(--dr-surface)] border border-[var(--dr-line)] hover:border-[var(--dr-accent)] text-[11px] tracking-[0.05em] uppercase whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dr-accent)]"
          >
            CUSTOMIZE
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <DarkroomFooter
          wordmark={wordmark}
          brandName={brandName}
          accentColor={preset.accent}
          lineColor={preset.line}
          totalLines={lineCount}
          animated={animated}
          showBackgroundLines={showBackgroundLines}
          presetLabel={preset.label}
          onOpenContact={() => setModal({ type: 'contact' })}
          onOpenSponsor={() => setModal({ type: 'sponsor' })}
          onSelectLink={handleSelectLink}
          onCyclePreset={handleCyclePreset}
          onToggleAnimated={() => setAnimated((prev) => !prev)}
          onCycleDensity={handleCycleDensity}
          onOpenCustomizer={() => setCustomizerOpen(true)}
        />
      </main>

      <FooterModals modal={modal} onClose={() => setModal({ type: 'none' })} />

      <CustomizerDrawer
        open={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        wordmark={wordmark}
        onWordmarkChange={setWordmark}
        brandName={brandName}
        onBrandNameChange={setBrandName}
        preset={preset}
        onPresetChange={(next) => {
          const idx = SAFELIGHT_PRESETS.findIndex((p) => p.id === next.id);
          if (idx >= 0) setPresetIndex(idx);
        }}
        lineCount={lineCount}
        onLineCountChange={setLineCount}
        animated={animated}
        onToggleAnimated={() => setAnimated((prev) => !prev)}
        showBackgroundLines={showBackgroundLines}
        onToggleBackgroundLines={() => setShowBackgroundLines((prev) => !prev)}
      />
    </div>
  );
}
