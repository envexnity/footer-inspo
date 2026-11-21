import React, { useEffect, useState } from 'react';
import { Check, Copy, Download, X } from 'lucide-react';
import { SAFELIGHT_PRESETS, SafelightPreset } from '../data/footerData';
import { buildSingleHtmlDocument } from '../utils/exportSingleHtml';

interface CustomizerDrawerProps {
  open: boolean;
  onClose: () => void;
  wordmark: string;
  onWordmarkChange: (value: string) => void;
  brandName: string;
  onBrandNameChange: (value: string) => void;
  preset: SafelightPreset;
  onPresetChange: (preset: SafelightPreset) => void;
  lineCount: number;
  onLineCountChange: (count: number) => void;
  animated: boolean;
  onToggleAnimated: () => void;
  showBackgroundLines: boolean;
  onToggleBackgroundLines: () => void;
}

export const CustomizerDrawer: React.FC<CustomizerDrawerProps> = ({
  open,
  onClose,
  wordmark,
  onWordmarkChange,
  brandName,
  onBrandNameChange,
  preset,
  onPresetChange,
  lineCount,
  onLineCountChange,
  animated,
  onToggleAnimated,
  showBackgroundLines,
  onToggleBackgroundLines,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleCopyConfig = async () => {
    const snippet = JSON.stringify(
      {
        wordmark: wordmark || 'DARKROOM',
        brand: brandName || 'DARKROOM.ENGINEERING',
        theme: preset.id,
        colors: {
          background: preset.bg,
          accent: preset.accent,
          surface: preset.surface,
        },
        scanlines: lineCount,
        animated,
        backgroundRaster: showBackgroundLines,
      },
      null,
      2
    );

    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleDownloadSingleHtml = () => {
    const html = buildSingleHtmlDocument({
      wordmark,
      brandName,
      preset,
      lineCount,
      animated,
      showBackgroundLines,
    });
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(wordmark.trim() || 'darkroom').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-footer.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <aside
      aria-label="Footer Customizer"
      className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[var(--dr-bg)] border-l border-[var(--dr-line-strong)] text-[var(--dr-accent)] p-6 flex flex-col justify-between overflow-y-auto shadow-2xl"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--dr-line)] pb-4">
          <span className="text-xs font-medium tracking-[0.08em] uppercase">
            FOOTER CUSTOMIZER
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close customizer"
            className="inline-flex items-center justify-center w-9 h-9 border border-[var(--dr-line-strong)] bg-[var(--dr-surface)] hover:bg-[var(--dr-accent)] hover:text-[var(--dr-cta-text)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="block text-[11px] tracking-[0.06em] text-[var(--dr-accent-muted)]">
              SCANLINE WORDMARK
            </span>
            <input
              type="text"
              maxLength={14}
              value={wordmark}
              onChange={(e) => onWordmarkChange(e.target.value.toUpperCase())}
              placeholder="DARKROOM"
              className="w-full px-3 py-2.5 bg-[var(--dr-surface)] border border-[var(--dr-line)] focus:border-[var(--dr-accent)] focus:outline-none text-xs tracking-[0.06em] uppercase text-[var(--dr-accent)]"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="block text-[11px] tracking-[0.06em] text-[var(--dr-accent-muted)]">
              COPYRIGHT DOMAIN
            </span>
            <input
              type="text"
              maxLength={32}
              value={brandName}
              onChange={(e) => onBrandNameChange(e.target.value.toUpperCase())}
              placeholder="DARKROOM.ENGINEERING"
              className="w-full px-3 py-2.5 bg-[var(--dr-surface)] border border-[var(--dr-line)] focus:border-[var(--dr-accent)] focus:outline-none text-xs tracking-[0.06em] uppercase text-[var(--dr-accent)]"
            />
          </label>
        </div>

        <div className="space-y-2">
          <span className="block text-[11px] tracking-[0.06em] text-[var(--dr-accent-muted)]">
            SAFELIGHT PALETTE
          </span>
          <div className="grid grid-cols-2 gap-2">
            {SAFELIGHT_PRESETS.map((item) => {
              const isSelected = item.id === preset.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onPresetChange(item)}
                  className={`flex items-center gap-2 px-3 py-2.5 border text-[11px] tracking-[0.04em] uppercase transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[var(--dr-accent)] bg-[var(--dr-accent)] text-[var(--dr-cta-text)] font-medium'
                      : 'border-[var(--dr-line)] bg-[var(--dr-surface)] text-[var(--dr-accent)] hover:border-[var(--dr-accent)]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="w-3 h-3 shrink-0 border border-current"
                    style={{ backgroundColor: item.accent }}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] tracking-[0.06em]">
            <span className="text-[var(--dr-accent-muted)]">SCANLINE DENSITY</span>
            <span className="tabular-nums">{lineCount} LINES</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[22, 26, 32].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => onLineCountChange(count)}
                className={`py-2 border text-xs tabular-nums tracking-[0.04em] cursor-pointer transition-colors ${
                  lineCount === count
                    ? 'bg-[var(--dr-accent)] text-[var(--dr-cta-text)] border-[var(--dr-accent)] font-medium'
                    : 'bg-[var(--dr-surface)] text-[var(--dr-accent)] border-[var(--dr-line)] hover:border-[var(--dr-accent)]'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onToggleAnimated}
            aria-pressed={animated}
            className="w-full flex items-center justify-between px-3 py-2.5 border border-[var(--dr-line)] bg-[var(--dr-surface)] hover:border-[var(--dr-accent)] text-xs tracking-[0.05em] uppercase cursor-pointer"
          >
            <span>KINETIC WAVE</span>
            <span>{animated ? 'ACTIVE' : 'PAUSED'}</span>
          </button>
          <button
            type="button"
            onClick={onToggleBackgroundLines}
            aria-pressed={showBackgroundLines}
            className="w-full flex items-center justify-between px-3 py-2.5 border border-[var(--dr-line)] bg-[var(--dr-surface)] hover:border-[var(--dr-accent)] text-xs tracking-[0.05em] uppercase cursor-pointer"
          >
            <span>BACKGROUND RASTER</span>
            <span>{showBackgroundLines ? 'VISIBLE' : 'HIDDEN'}</span>
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-[var(--dr-line)] space-y-2">
        <button
          type="button"
          onClick={handleDownloadSingleHtml}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[var(--dr-accent)] text-[var(--dr-cta-text)] text-xs font-medium tracking-[0.06em] uppercase hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>DOWNLOAD SINGLE HTML</span>
        </button>
        <button
          type="button"
          onClick={handleCopyConfig}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--dr-line-strong)] bg-[var(--dr-surface)] text-[var(--dr-accent)] text-xs font-medium tracking-[0.06em] uppercase hover:border-[var(--dr-accent)] transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'COPIED PRESET JSON' : 'COPY PRESET JSON'}</span>
        </button>
      </div>
    </aside>
  );
};
