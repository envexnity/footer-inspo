export interface FooterLinkItem {
  label: string;
  href: string;
  description: string;
  category: string;
}

export interface FooterColumn {
  heading: string;
  links: FooterLinkItem[];
}

export interface SafelightPreset {
  id: string;
  label: string;
  bg: string;
  accent: string;
  accentMuted: string;
  surface: string;
  surfaceHover: string;
  line: string;
  lineStrong: string;
  ctaText: string;
}

export const SAFELIGHT_PRESETS: SafelightPreset[] = [
  {
    id: 'safelight-red',
    label: 'Safelight Red',
    bg: '#000000',
    accent: '#ff0d00',
    accentMuted: '#b81209',
    surface: '#260402',
    surfaceHover: '#3f0703',
    line: 'rgba(255, 13, 0, 0.24)',
    lineStrong: 'rgba(255, 13, 0, 0.45)',
    ctaText: '#000000',
  },
  {
    id: 'amber-lab',
    label: 'Amber Lab',
    bg: '#050300',
    accent: '#ff8a00',
    accentMuted: '#b56000',
    surface: '#241300',
    surfaceHover: '#3d2000',
    line: 'rgba(255, 138, 0, 0.24)',
    lineStrong: 'rgba(255, 138, 0, 0.45)',
    ctaText: '#000000',
  },
  {
    id: 'phosphor-crt',
    label: 'Phosphor CRT',
    bg: '#010502',
    accent: '#18ff6d',
    accentMuted: '#0da646',
    surface: '#022610',
    surfaceHover: '#043d1a',
    line: 'rgba(24, 255, 109, 0.22)',
    lineStrong: 'rgba(24, 255, 109, 0.44)',
    ctaText: '#000000',
  },
  {
    id: 'daylight-print',
    label: 'Daylight Print',
    bg: '#f2f0ec',
    accent: '#e10a00',
    accentMuted: '#8a1610',
    surface: '#e3dcd9',
    surfaceHover: '#d6cbc6',
    line: 'rgba(225, 10, 0, 0.2)',
    lineStrong: 'rgba(225, 10, 0, 0.4)',
    ctaText: '#f2f0ec',
  },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: 'NAV',
    links: [
      {
        label: 'HOME',
        href: '#home',
        category: 'Navigation',
        description: 'Studio overview, engineering capabilities, and current creative direction.',
      },
      {
        label: 'WORK',
        href: '#work',
        category: 'Navigation',
        description: 'Selected interactive experiences, WebGL flagships, and design systems.',
      },
      {
        label: 'ABOUT',
        href: '#about',
        category: 'Navigation',
        description: 'Independent creative technology studio operating across ARG, CET, and WET.',
      },
      {
        label: 'CONTACT',
        href: '#contact',
        category: 'Navigation',
        description: 'Start a project conversation or technical consultation.',
      },
    ],
  },
  {
    heading: 'OPEN SOURCE',
    links: [
      {
        label: 'ALL OSS PROJECTS',
        href: '#oss-all',
        category: 'Open Source',
        description: 'Directory of performance-focused animation, layout, and creative coding tools.',
      },
      {
        label: 'SATUS',
        href: '#oss-satus',
        category: 'Open Source',
        description: 'Opinionated Next.js starter kit engineered for smooth creative web apps.',
      },
      {
        label: 'LENIS',
        href: '#oss-lenis',
        category: 'Open Source',
        description: 'Lightweight, smooth-scroll engine built for 60fps WebGL synchronization.',
      },
      {
        label: 'HAMO',
        href: '#oss-hamo',
        category: 'Open Source',
        description: 'Collection of focused React hooks for layout, media queries, and observers.',
      },
      {
        label: 'TEMPUS',
        href: '#oss-tempus',
        category: 'Open Source',
        description: 'Unified requestAnimationFrame loop manager with priority scheduling.',
      },
      {
        label: 'ELASTICA',
        href: '#oss-elastica',
        category: 'Open Source',
        description: 'Physics-inspired spring and elastic motion primitives for interactive UI.',
      },
      {
        label: 'ANISO',
        href: '#oss-aniso',
        category: 'Open Source',
        description: 'Anisotropic shader and optical distortion utilities for WebGL pipelines.',
      },
      {
        label: 'CC-SETTINGS',
        href: '#oss-cc-settings',
        category: 'Open Source',
        description: 'Zero-overhead configuration toolkit for creative coding environments.',
      },
    ],
  },
  {
    heading: 'SOCIAL',
    links: [
      {
        label: 'GITHUB',
        href: '#social-github',
        category: 'Social',
        description: 'Open-source repositories, releases, and engineering experiments.',
      },
      {
        label: 'X (TWITTER)',
        href: '#social-x',
        category: 'Social',
        description: 'Work-in-progress shaders, motion tests, and studio dispatches.',
      },
      {
        label: 'INSTAGRAM',
        href: '#social-instagram',
        category: 'Social',
        description: 'Visual studies, studio photography, and launch reels.',
      },
      {
        label: 'LINKEDIN',
        href: '#social-linkedin',
        category: 'Social',
        description: 'Studio announcements, partnerships, and engineering roles.',
      },
    ],
  },
  {
    heading: 'INSPIRATION',
    links: [
      {
        label: 'IMPORTANT VIDEO',
        href: '#inspo-video',
        category: 'Curated Archive',
        description: 'Kinetic typography & analog CRT raster experiments from early broadcast graphics.',
      },
      {
        label: 'A MEANINGFUL SONG',
        href: '#inspo-song',
        category: 'Curated Archive',
        description: 'Ambient modular synthesis and tape-loop textures that set late-night build tempo.',
      },
      {
        label: 'GREAT BOOK BTW',
        href: '#inspo-book',
        category: 'Curated Archive',
        description: 'Grid Systems in Graphic Design — Josef Müller-Brockmann on disciplined structure.',
      },
      {
        label: 'AMAZING GAME',
        href: '#inspo-game',
        category: 'Curated Archive',
        description: 'Inside — minimalist atmosphere, silhouette pacing, and tactile physics.',
      },
      {
        label: 'A GOOD MOVIE',
        href: '#inspo-movie',
        category: 'Curated Archive',
        description: 'Blade Runner 2049 — brutalist scale, monochrome fog, and optical light craft.',
      },
    ],
  },
];
