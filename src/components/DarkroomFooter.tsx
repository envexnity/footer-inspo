import React, { useEffect, useState } from 'react';
import { FOOTER_COLUMNS, FooterLinkItem } from '../data/footerData';
import { getStudioClocks, StudioClock } from '../utils/timezones';
import { ScanlineWordmark } from './ScanlineWordmark';

interface DarkroomFooterProps {
  wordmark: string;
  brandName: string;
  accentColor: string;
  lineColor: string;
  totalLines: number;
  animated: boolean;
  showBackgroundLines: boolean;
  presetLabel: string;
  onOpenContact: () => void;
  onOpenSponsor: () => void;
  onSelectLink: (item: FooterLinkItem) => void;
  onCyclePreset: () => void;
  onToggleAnimated: () => void;
  onCycleDensity: () => void;
  onOpenCustomizer: () => void;
}

export const DarkroomFooter: React.FC<DarkroomFooterProps> = ({
  wordmark,
  brandName,
  accentColor,
  lineColor,
  totalLines,
  animated,
  showBackgroundLines,
  presetLabel,
  onOpenContact,
  onOpenSponsor,
  onSelectLink,
  onCyclePreset,
  onToggleAnimated,
  onCycleDensity,
  onOpenCustomizer,
}) => {
  const [clocks, setClocks] = useState<StudioClock[]>(() => getStudioClocks(new Date()));

  useEffect(() => {
    const update = () => setClocks(getStudioClocks(new Date()));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="darkroom-footer"
      className="relative w-full min-h-[calc(100vh-44px)] flex flex-col justify-between bg-[var(--dr-bg)] text-[var(--dr-accent)] overflow-x-clip font-mono"
    >
      {/* Top Utility Strip */}
      <div className="relative px-3 sm:px-4 pt-3 pb-4">
        {/* Continuous horizontal hairline running behind top bar buttons */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-[26px] h-px bg-[var(--dr-line)]"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-y-3">
          {/* Top-left square utility controls */}
          <div className="lg:col-span-6 flex items-center justify-between lg:justify-start gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCyclePreset}
                aria-label={`Switch safelight palette (current: ${presetLabel})`}
                title={`Theme: ${presetLabel}`}
                className="group inline-flex items-center justify-center w-7 h-7 bg-[var(--dr-surface)] border border-[var(--dr-line)] hover:border-[var(--dr-accent)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dr-accent)]"
              >
                <span className="w-2 h-2 bg-white block transition-transform group-hover:scale-110" />
              </button>

              <button
                type="button"
                onClick={onToggleAnimated}
                aria-pressed={!animated}
                aria-label={animated ? 'Pause scanline motion' : 'Resume scanline motion'}
                title={animated ? 'Pause scanline wave' : 'Resume scanline wave'}
                className="group inline-flex items-center justify-center w-7 h-7 bg-[var(--dr-surface)] border border-[var(--dr-line)] hover:border-[var(--dr-accent)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dr-accent)]"
              >
                <span
                  className={`block transition-all ${
                    animated
                      ? 'w-2 h-[1.5px] bg-[var(--dr-accent)]'
                      : 'w-2 h-2 border border-[var(--dr-accent)]'
                  }`}
                />
              </button>
            </div>

            {/* Mobile sponsor + right controls */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={onCycleDensity}
                aria-label={`Cycle scanline density (current: ${totalLines} lines)`}
                className="inline-flex items-center justify-center w-7 h-7 bg-[var(--dr-surface)] border border-[var(--dr-line)] hover:border-[var(--dr-accent)] transition-colors cursor-pointer"
              >
                <span className="w-2 h-[1.5px] bg-white block" />
              </button>
              <button
                type="button"
                onClick={onOpenCustomizer}
                aria-label="Open footer customizer"
                className="inline-flex items-center justify-center w-7 h-7 bg-[var(--dr-surface)] border border-[var(--dr-line)] hover:border-[var(--dr-accent)] transition-colors cursor-pointer"
              >
                <span className="flex flex-col gap-[2px]">
                  <span className="w-2.5 h-[1.5px] bg-[var(--dr-accent)] block" />
                  <span className="w-2.5 h-[1.5px] bg-[var(--dr-accent)] block" />
                </span>
              </button>
            </div>
          </div>

          {/* Top-right half: Sponsor banner aligned with NAV column + far-right square buttons */}
          <div className="lg:col-span-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onOpenSponsor}
              className="px-3 py-1.5 bg-[var(--dr-surface)] hover:bg-[var(--dr-surface-hover)] text-[var(--dr-accent)] text-[11px] sm:text-xs tracking-[0.06em] uppercase whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dr-accent)]"
            >
              BECOME AN OPEN SOURCE SPONSOR
            </button>

            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onCycleDensity}
                aria-label={`Cycle scanline density (current: ${totalLines} lines)`}
                title={`Scanlines: ${totalLines}`}
                className="inline-flex items-center justify-center w-7 h-7 bg-[var(--dr-surface)] border border-[var(--dr-line)] hover:border-[var(--dr-accent)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dr-accent)]"
              >
                <span className="w-2 h-[1.5px] bg-white block" />
              </button>

              <button
                type="button"
                onClick={onOpenCustomizer}
                aria-label="Open footer customizer"
                title="Customize footer"
                className="inline-flex items-center justify-center w-7 h-7 bg-[var(--dr-surface)] border border-[var(--dr-line)] hover:border-[var(--dr-accent)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dr-accent)]"
              >
                <span className="flex flex-col gap-[2px]">
                  <span className="w-2.5 h-[1.5px] bg-[var(--dr-accent)] block" />
                  <span className="w-2.5 h-[1.5px] bg-[var(--dr-accent)] block" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation & CTA Row + Background Scanline Field */}
      <div className="relative flex-1 flex flex-col justify-between">
        {/* Subtle horizontal raster anchored to bottom (exact 14px pitch) */}
        {showBackgroundLines && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[308px] lg:top-[140px] bottom-0"
            style={{
              backgroundImage: `repeating-linear-gradient(to top, transparent 0px, transparent 6px, ${lineColor} 6px, ${lineColor} 7px, transparent 7px, transparent 14px)`,
              backgroundPosition: 'left bottom',
            }}
          />
        )}

        {/* CTA + Clocks (Left) & 4 Navigation Columns (Right) */}
        <div className="relative z-10 px-3 sm:px-4 pt-2 pb-4 grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-y-0">
          {/* Left Half: LET'S TALK CTA + Live Clocks */}
          <div className="lg:col-span-6 flex flex-wrap items-start gap-4 sm:gap-5">
            <button
              type="button"
              onClick={onOpenContact}
              className="group w-[166px] sm:w-[174px] h-[48px] px-4 bg-[var(--dr-accent)] text-[var(--dr-cta-text)] flex items-center justify-between text-xs font-medium tracking-[0.04em] uppercase whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dr-accent)]"
            >
              <span>LET&apos;S TALK</span>
              <span
                aria-hidden="true"
                className="text-sm leading-none transition-transform duration-150 group-hover:translate-x-1"
              >
                →
              </span>
            </button>

            <div
              aria-label="Studio local times"
              className="flex flex-col justify-center pt-0.5 text-[10px] sm:text-[11px] leading-[1.35] tracking-[0.05em] tabular-nums uppercase"
            >
              {clocks.map((clock) => (
                <div key={clock.code} className="whitespace-nowrap">
                  <span className="inline-block w-[30px]">{clock.code}</span>
                  <span>{clock.formattedTime}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Half: 4 Link Columns */}
          <nav
            aria-label="Footer navigation"
            className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6"
          >
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading} className="min-w-0">
                <h2 className="text-[10px] tracking-[0.06em] uppercase text-[var(--dr-accent-muted)] mb-2.5 font-normal">
                  {col.heading}
                </h2>
                <ul className="space-y-1">
                  {col.links.map((item) => (
                    <li key={item.label}>
                      <button
                        type="button"
                        onClick={() => onSelectLink(item)}
                        className="text-left text-[11px] sm:text-[12px] leading-[1.45] tracking-[0.04em] uppercase text-[var(--dr-accent)] hover:underline underline-offset-4 decoration-1 transition-opacity hover:opacity-80 cursor-pointer whitespace-nowrap truncate max-w-full block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dr-accent)]"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Centerpiece Halftone Scanline Wordmark + Lower 42px Copyright Row (3 * 14px) */}
        <div className="relative z-10 w-full mt-auto flex flex-col">
          <ScanlineWordmark
            text={wordmark}
            accentColor={accentColor}
            lineColor={lineColor}
            totalLines={totalLines}
            animated={animated}
            showBackgroundLines={showBackgroundLines}
          />

          <div className="h-[42px] px-3 sm:px-4 flex items-center justify-between gap-2 text-[10px] sm:text-[11px] tracking-[0.05em] uppercase">
            <span>
              ©{currentYear} {brandName || 'DARKROOM.ENGINEERING'}
            </span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
