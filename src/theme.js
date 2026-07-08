/**
 * ══════════════════════════════════════════════════════
 *  LVB SURAT PLATINUM — CENTRALIZED THEME TOKENS
 *  Single source of truth for the entire design system.
 *
 *  ➜  CSS custom properties in index.css mirror these.
 *  ➜  Use CSS variables in JSX/CSS; import this file
 *     only where raw JS values are required (e.g. canvas,
 *     chart libraries, dynamic motion values).
 * ══════════════════════════════════════════════════════
 */

export const colors = {
  // ── Core Brand ────────────────────────────────────────
  primary:         '#0B1F3A',   // Deep Navy
  primaryLight:    '#1a3a6b',   // Navy hover / lighter shade
  primaryDark:     '#06122A',   // Navy pressed

  secondary:       '#14b8a6',   // Mint
  secondaryDark:   '#0d9488',   // Mint pressed
  secondaryLight:  '#5eead4',   // Light Mint (alias: accent)

  accent:          '#5eead4',   // Light Mint

  // ── Backgrounds ───────────────────────────────────────
  bg:              '#FFFFFF',   // Primary page background
  bgAlt:           '#FAF8F3',   // Alternate / cream section bg
  bgDark:          '#0B1F3A',   // Dark footer / CTA backgrounds

  // ── Surfaces / Cards ──────────────────────────────────
  surface:         '#FFFFFF',
  surfaceHover:    '#FDF9F0',

  // ── Borders ───────────────────────────────────────────
  border:          '#99f6e4',   // Light mint border
  borderSubtle:    '#ccfbf1',   // Very soft mint border

  // ── Typography ────────────────────────────────────────
  heading:         '#0B1F3A',   // Dark navy headings
  body:            '#4A5568',   // Neutral gray body text
  muted:           '#9CA3AF',   // Light gray muted text
  onPrimary:       '#FFFFFF',   // Text on navy backgrounds
  onSecondary:     '#FFFFFF',   // Text on mint backgrounds (white contrast better on #14b8a6 than navy)
};

export const fonts = {
  display: "'Cormorant Garamond', Georgia, serif",
  sans:    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

export const radii = {
  sm:  '0.5rem',    //  8px
  md:  '0.75rem',   // 12px
  lg:  '1rem',      // 16px
  xl:  '1.5rem',    // 24px
  '2xl': '2rem',    // 32px
  full: '9999px',
};

export const shadows = {
  card:        '0 2px 16px 0 rgba(11, 31, 58, 0.06)',
  cardHover:   '0 8px 32px 0 rgba(20, 184, 166, 0.18)',
  navbar:      '0 2px 20px 0 rgba(11, 31, 58, 0.08)',
  btn:         '0 4px 14px 0 rgba(20, 184, 166, 0.30)',
  btnHover:    '0 6px 20px 0 rgba(20, 184, 166, 0.40)',
};

export const transitions = {
  fast:    'all 0.15s ease',
  default: 'all 0.25s ease',
  slow:    'all 0.4s ease',
};

/** Framer-motion reusable variants */
export const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 28 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

export const fadeUpView = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true },
  transition:  { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

/** CSS variable helpers — call in inline style props when needed */
export const v = {
  primary:       'var(--color-primary)',
  primaryLight:  'var(--color-primary-light)',
  secondary:     'var(--color-secondary)',
  secondaryDark: 'var(--color-secondary-dark)',
  accent:        'var(--color-accent)',
  bg:            'var(--color-bg)',
  bgAlt:         'var(--color-bg-alt)',
  bgDark:        'var(--color-bg-dark)',
  surface:       'var(--color-surface)',
  surfaceHover:  'var(--color-surface-hover)',
  border:        'var(--color-border)',
  borderSubtle:  'var(--color-border-subtle)',
  heading:       'var(--color-heading)',
  body:          'var(--color-body)',
  muted:         'var(--color-muted)',
  onPrimary:     'var(--color-on-primary)',
  onSecondary:   'var(--color-on-secondary)',
  fontDisplay:   'var(--font-display)',
  fontSans:      'var(--font-sans)',
  shadowCard:    'var(--shadow-card)',
  shadowHover:   'var(--shadow-card-hover)',
  shadowNavbar:  'var(--shadow-navbar)',
  shadowBtn:     'var(--shadow-btn)',
  radiusSm:      'var(--radius-sm)',
  radiusMd:      'var(--radius-md)',
  radiusLg:      'var(--radius-lg)',
  radiusXl:      'var(--radius-xl)',
};

export default { colors, fonts, radii, shadows, transitions, fadeUp, fadeUpView, v };
