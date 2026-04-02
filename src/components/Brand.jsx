/**
 * Viotel brand system — single source of truth.
 * All branding touchpoints import from here.
 */

export const BRAND = {
  name:    'Viotel',
  tagline: 'Smarter Infrastructure Monitoring',
  sub:     'Cloud-Based Asset Intelligence',
  domain:  'viotel.io',
  year:    2025,
}

/**
 * The Viotel logo mark — a precision geometric signal icon.
 * Inspired by: tower signal + data pulse + connectivity node.
 * Original design, not a copy of any trademark.
 */
export function LogoMark({ size = 32, className = '' }) {
  const r = size / 32  // scale ratio

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-label="Viotel logo"
    >
      <defs>
        <linearGradient id="vt-grad-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#00e5ff"/>
          <stop offset="55%"  stopColor="#0288d1"/>
          <stop offset="100%" stopColor="#1565c0"/>
        </linearGradient>
        <linearGradient id="vt-grad-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.25)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </linearGradient>
      </defs>

      {/* Background tile */}
      <rect width="32" height="32" rx="8" fill="url(#vt-grad-a)"/>

      {/* Subtle inner highlight */}
      <rect width="32" height="16" rx="8" fill="url(#vt-grad-b)" opacity="0.4"/>

      {/* Signal arc — outer */}
      <path
        d="M7 16C7 11.03 11.03 7 16 7"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M25 16C25 20.97 20.97 25 16 25"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Signal arc — inner */}
      <path
        d="M10 16C10 12.69 12.69 10 16 10"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M22 16C22 19.31 19.31 22 16 22"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Center node */}
      <circle cx="16" cy="16" r="3" fill="white"/>
      <circle cx="16" cy="16" r="1.4" fill="url(#vt-grad-a)"/>

      {/* Pulse ring */}
      <circle cx="16" cy="16" r="5.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none"/>
    </svg>
  )
}

/**
 * Full brand lockup — logo + name + optional tagline.
 * Use in sidebar, login, and any brand-prominent surface.
 */
export function BrandLockup({ size = 'md', showTagline = false, theme = 'dark' }) {
  const sizes = {
    sm: { logo: 26, name: 13,   tag: 8.5  },
    md: { logo: 32, name: 14.5, tag: 9    },
    lg: { logo: 40, name: 17,   tag: 10   },
    xl: { logo: 52, name: 22,   tag: 11.5 },
  }
  const s = sizes[size] ?? sizes.md
  const nameColor  = theme === 'dark' ? '#edf2f7' : '#0c1420'
  const tagColor   = theme === 'dark' ? 'rgba(255,255,255,0.28)' : '#9aaabb'

  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      <LogoMark size={s.logo} />
      <div>
        <p
          className="font-bold leading-none"
          style={{ fontSize: s.name, color: nameColor, letterSpacing: '-0.022em' }}
        >
          {BRAND.name}
        </p>
        {showTagline ? (
          <p
            className="font-medium leading-none"
            style={{ fontSize: s.tag, marginTop: 4, color: tagColor, letterSpacing: '0.01em' }}
          >
            {BRAND.tagline}
          </p>
        ) : (
          <p
            className="font-semibold uppercase leading-none"
            style={{ fontSize: s.tag - 0.5, marginTop: 3.5, color: tagColor, letterSpacing: '0.13em' }}
          >
            {BRAND.sub}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Standalone logo mark in a styled container — for sidebar header.
 */
export function SidebarBrand({ isDark }) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark size={30} />
      <div>
        <p
          className="font-bold leading-none"
          style={{
            fontSize: 14,
            letterSpacing: '-0.022em',
            color: isDark ? '#edf2f7' : '#0c1420',
          }}
        >
          {BRAND.name}
        </p>
        <p
          className="font-semibold uppercase leading-none"
          style={{
            fontSize: 8.5,
            marginTop: 3.5,
            letterSpacing: '0.14em',
            color: isDark ? 'rgba(255,255,255,0.26)' : '#9aaabb',
          }}
        >
          {BRAND.sub}
        </p>
      </div>
    </div>
  )
}
