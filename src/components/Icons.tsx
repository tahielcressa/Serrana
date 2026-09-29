interface IconProps {
  className?: string
}

export const HeartIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 21c-4.5-3.4-8-6.1-8-9.6C4 8.5 6.2 6.5 8.6 6.5c1.4 0 2.7.7 3.4 1.8.7-1.1 2-1.8 3.4-1.8 2.4 0 4.6 2 4.6 4.9 0 3.5-3.5 6.2-8 9.6Z" />
  </svg>
)

export const StarIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4 6.2 20.9l1.1-6.5L2.6 9.9l6.5-.9L12 2.5Z" />
  </svg>
)

export const PinIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
)

export const UserIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-3.6 3.6-5.5 8-5.5s8 1.9 8 5.5" />
  </svg>
)

export const SearchIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

export const MenuIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const CloseIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const CompassIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </svg>
)

export const MountainIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 20 6-13 3.5 7.5L15 11l6 9H3Z" />
  </svg>
)

export const TentIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 4 3 20h18L12 4Z" />
    <path d="M12 4v16" />
    <path d="m12 20-4.5-7h9L12 20Z" />
  </svg>
)

export const DomeIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 19a9 9 0 0 1 18 0" />
    <path d="M3 19h18M12 10v9M7.5 12.5 12 10l4.5 2.5" />
  </svg>
)

export const CabinIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 20V10l8-6 8 6v10" />
    <path d="M10 20v-5h4v5M4 14h16" />
  </svg>
)

export const BackpackIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="6" y="7" width="12" height="13" rx="3" />
    <path d="M9 7V5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V7M6 12h12M10 12v2h4v-2" />
  </svg>
)

export const CampfireIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3c3 3.5 4.5 6 4.5 8a4.5 4.5 0 0 1-9 0c0-1.2.4-2.3 1.2-3.4" />
    <path d="M3 20h18M6.5 20l5.5-6 5.5 6" />
  </svg>
)

export const VanIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 16V7a1 1 0 0 1 1-1h9v10" />
    <path d="M13 10h4l3 3v3h-2" />
    <circle cx="7.5" cy="17.5" r="1.8" />
    <circle cx="16.5" cy="17.5" r="1.8" />
  </svg>
)

export const WalkIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="13" cy="4.5" r="1.8" />
    <path d="m10 21 2.5-5.5L11 13l-1.5 3M13.5 9 9.5 11.5 7 10M13.5 9l3 3 2 .5M13.5 9l-1 4.5 3 3.5" />
  </svg>
)

export const ClockIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)

export const ChartIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19 10 11l4 4 6-8" />
    <path d="M4 19h16" />
  </svg>
)

export const LayersIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </svg>
)

export const ChevronRightIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 5 7 7-7 7" />
  </svg>
)

export const SparkIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="m12 3 2.2 5.6L20 11l-5.8 2.4L12 19l-2.2-5.6L4 11l5.8-2.4L12 3Z" />
  </svg>
)

export const CheckIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
)

export const PlusIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const InboxIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 13h4l1.5 3h7L17 13h4" />
    <path d="M5.5 5h13l2.5 8v6H3v-6l2.5-8Z" />
  </svg>
)

export const UsersIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.3 2.9-5.2 6.5-5.2s6.5 1.9 6.5 5.2" />
    <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M18 14.5c2.2.5 3.5 2 3.5 4.5" />
  </svg>
)

export const EditIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 20h4L19 9a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5 4 20Z" />
  </svg>
)

export const TrashIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
  </svg>
)

export const ArrowLeftIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 12H4M10 6l-6 6 6 6" />
  </svg>
)
export const FilmIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
    <path d="M7.5 4v16M16.5 4v16M2.5 12h19M2.5 8h5M2.5 16h5M16.5 8h5M16.5 16h5" />
  </svg>
)

export const GearIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.5 6.5a4 4 0 0 0 5.2 4.9l.2-1.4 1.6.9-.4 1.4a4 4 0 0 0 2.6 6l-1 1-1.2-1a4 4 0 0 0-6 2.6l.2 1.5-1.5.2-.9-1.4a4 4 0 0 0-6-1.5l-1.4.4-.7-1.5a4 4 0 0 0 2.4-6l-1.2-.9.7-1.5 1.5-.2a4 4 0 0 0 4.9-5.1Z" />
    <circle cx="12" cy="12" r="2.6" />
  </svg>
)

export const CameraIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 8.5h3.2l1.4-2.3h8.8l1.4 2.3H21v11H3z" />
    <circle cx="12" cy="13.5" r="3.4" />
  </svg>
)
