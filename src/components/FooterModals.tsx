import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { FooterLinkItem } from '../data/footerData';

export type ActiveModal =
  | { type: 'none' }
  | { type: 'contact' }
  | { type: 'sponsor' }
  | { type: 'link'; item: FooterLinkItem };

interface FooterModalsProps {
  modal: ActiveModal;
  onClose: () => void;
}

const SPONSOR_TIERS = [
  { id: 'supporter', amount: '$10 / MO', label: 'INDIVIDUAL SUPPORTER' },
  { id: 'studio', amount: '$50 / MO', label: 'STUDIO BACKER' },
  { id: 'partner', amount: '$250 / MO', label: 'ENGINEERING PARTNER' },
];

export const FooterModals: React.FC<FooterModalsProps> = ({ modal, onClose }) => {
  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [scope, setScope] = useState('WEB EXPERIENCE & MOTION');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Sponsor state
  const [selectedTier, setSelectedTier] = useState('studio');
  const [sponsorConfirmed, setSponsorConfirmed] = useState(false);

  useEffect(() => {
    if (modal.type === 'none') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [modal.type, onClose]);

  useEffect(() => {
    setFormError('');
    setSubmittedRef(null);
    setSponsorConfirmed(false);
  }, [modal]);

  if (modal.type === 'none') return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMsg = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMsg) {
      setFormError('ALL FIELDS ARE REQUIRED TO DISPATCH AN INQUIRY.');
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!emailValid) {
      setFormError('ENTER A VALID EMAIL ADDRESS (E.G. STUDIO@DOMAIN.COM).');
      return;
    }

    setFormError('');
    setSubmittedRef(`DR-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-label={
        modal.type === 'contact'
          ? "Let's Talk inquiry dialog"
          : modal.type === 'sponsor'
            ? 'Open Source Sponsor dialog'
            : modal.item.label
      }
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg border border-[var(--dr-line-strong)] bg-[var(--dr-bg)] text-[var(--dr-accent)] p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--dr-line)] pb-4 mb-6">
          <span className="text-[11px] tracking-[0.08em] uppercase text-[var(--dr-accent-muted)]">
            {modal.type === 'contact' && 'NEW PROJECT INQUIRY'}
            {modal.type === 'sponsor' && 'OPEN SOURCE SPONSORSHIP'}
            {modal.type === 'link' && modal.item.category.toUpperCase()}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex items-center justify-center w-9 h-9 border border-[var(--dr-line-strong)] bg-[var(--dr-surface)] hover:bg-[var(--dr-accent)] hover:text-[var(--dr-cta-text)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {modal.type === 'contact' && (
          <>
            {submittedRef ? (
              <div className="space-y-5 py-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--dr-surface)] border border-[var(--dr-line-strong)] text-xs tracking-[0.06em]">
                  <Check className="w-4 h-4" />
                  <span>DISPATCH CONFIRMED · REF {submittedRef}</span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--dr-accent)]">
                  THANK YOU, {name.trim().toUpperCase()}. OUR TEAM ACROSS ARG, CET, AND WET HAS
                  RECEIVED YOUR BRIEF FOR <span className="underline">{scope}</span> AND WILL
                  REPLY TO {email.trim().toUpperCase()} WITHIN ONE BUSINESS DAY.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setName('');
                    setEmail('');
                    setMessage('');
                    onClose();
                  }}
                  className="px-5 py-3 bg-[var(--dr-accent)] text-[var(--dr-cta-text)] text-xs font-medium tracking-[0.06em] uppercase hover:opacity-90 transition-opacity cursor-pointer"
                >
                  RETURN TO FOOTER
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} noValidate className="space-y-4">
                <h2 className="text-lg font-medium tracking-[0.04em] uppercase">LET&apos;S TALK</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block space-y-1.5">
                    <span className="block text-[11px] tracking-[0.06em] text-[var(--dr-accent-muted)]">
                      NAME
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="JANE DOE"
                      className="w-full px-3 py-2.5 bg-[var(--dr-surface)] border border-[var(--dr-line)] focus:border-[var(--dr-accent)] focus:outline-none text-xs tracking-[0.04em] text-[var(--dr-accent)] placeholder:text-[var(--dr-accent-muted)]/60"
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="block text-[11px] tracking-[0.06em] text-[var(--dr-accent-muted)]">
                      EMAIL
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="YOU@STUDIO.COM"
                      className="w-full px-3 py-2.5 bg-[var(--dr-surface)] border border-[var(--dr-line)] focus:border-[var(--dr-accent)] focus:outline-none text-xs tracking-[0.04em] text-[var(--dr-accent)] placeholder:text-[var(--dr-accent-muted)]/60"
                    />
                  </label>
                </div>

                <label className="block space-y-1.5">
                  <span className="block text-[11px] tracking-[0.06em] text-[var(--dr-accent-muted)]">
                    ENGAGEMENT SCOPE
                  </span>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[var(--dr-surface)] border border-[var(--dr-line)] focus:border-[var(--dr-accent)] focus:outline-none text-xs tracking-[0.04em] text-[var(--dr-accent)]"
                  >
                    <option value="WEB EXPERIENCE & MOTION">WEB EXPERIENCE &amp; MOTION</option>
                    <option value="DESIGN SYSTEM & ENGINEERING">DESIGN SYSTEM &amp; ENGINEERING</option>
                    <option value="OPEN SOURCE COLLABORATION">OPEN SOURCE COLLABORATION</option>
                    <option value="TECHNICAL CONSULTING">TECHNICAL CONSULTING</option>
                  </select>
                </label>

                <label className="block space-y-1.5">
                  <span className="block text-[11px] tracking-[0.06em] text-[var(--dr-accent-muted)]">
                    PROJECT BRIEF
                  </span>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="TELL US ABOUT TIMELINE, GOALS, AND TECHNICAL STACK..."
                    className="w-full px-3 py-2.5 bg-[var(--dr-surface)] border border-[var(--dr-line)] focus:border-[var(--dr-accent)] focus:outline-none text-xs tracking-[0.04em] text-[var(--dr-accent)] placeholder:text-[var(--dr-accent-muted)]/60 resize-none"
                  />
                </label>

                {formError && (
                  <p role="alert" className="text-xs tracking-[0.04em] border border-[var(--dr-accent)] px-3 py-2 bg-[var(--dr-surface)]">
                    {formError}
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 border border-[var(--dr-line)] text-xs tracking-[0.06em] hover:border-[var(--dr-accent)] transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-3 px-5 py-2.5 bg-[var(--dr-accent)] text-[var(--dr-cta-text)] text-xs font-medium tracking-[0.06em] uppercase hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <span>SEND MESSAGE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {modal.type === 'sponsor' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-medium tracking-[0.04em] uppercase mb-2">
                BECOME AN OPEN SOURCE SPONSOR
              </h2>
              <p className="text-xs leading-relaxed text-[var(--dr-accent-muted)]">
                SUPPORT MAINTAINERS OF LENIS, TEMPUS, HAMO, SATUS, ELASTICA, ANISO, AND CC-SETTINGS.
              </p>
            </div>

            <div className="space-y-2">
              {SPONSOR_TIERS.map((tier) => {
                const active = selectedTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      setSelectedTier(tier.id);
                      setSponsorConfirmed(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 border text-xs tracking-[0.05em] transition-colors cursor-pointer ${
                      active
                        ? 'bg-[var(--dr-accent)] text-[var(--dr-cta-text)] border-[var(--dr-accent)] font-medium'
                        : 'bg-[var(--dr-surface)] text-[var(--dr-accent)] border-[var(--dr-line)] hover:border-[var(--dr-accent)]'
                    }`}
                  >
                    <span>{tier.label}</span>
                    <span className="tabular-nums">{tier.amount}</span>
                  </button>
                );
              })}
            </div>

            {sponsorConfirmed ? (
              <div className="p-3 bg-[var(--dr-surface)] border border-[var(--dr-line-strong)] text-xs tracking-[0.05em] flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>
                  TIER SELECTED ({SPONSOR_TIERS.find((t) => t.id === selectedTier)?.amount}). THANK
                  YOU FOR BACKING OPEN SOURCE CREATIVE ENGINEERING.
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setSponsorConfirmed(true)}
                  className="inline-flex items-center gap-3 px-5 py-3 bg-[var(--dr-accent)] text-[var(--dr-cta-text)] text-xs font-medium tracking-[0.06em] uppercase hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <span>CONFIRM SPONSOR TIER</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {modal.type === 'link' && (
          <div className="space-y-5">
            <h2 className="text-lg font-medium tracking-[0.04em] uppercase">{modal.item.label}</h2>
            <p className="text-xs leading-relaxed tracking-[0.03em] text-[var(--dr-accent)]">
              {modal.item.description}
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-[var(--dr-line)] text-[11px] text-[var(--dr-accent-muted)]">
              <span>ROUTE · {modal.item.href.toUpperCase()}</span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[var(--dr-accent)] text-[var(--dr-cta-text)] text-xs font-medium tracking-[0.05em] uppercase cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
