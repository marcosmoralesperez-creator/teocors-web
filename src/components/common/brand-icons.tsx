// Brand marks drawn in the same 24px, 1.5 stroke language as Lucide
// (lucide-react no longer ships brand logos).

function BrandSvg({ children, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const InstagramIcon = (props: React.ComponentProps<'svg'>) => (
  <BrandSvg {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
  </BrandSvg>
);

export const TikTokIcon = (props: React.ComponentProps<'svg'>) => (
  <BrandSvg {...props}>
    <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
    <path d="M14 3c.4 2.9 2.3 4.7 5 4.9" />
  </BrandSvg>
);

export const YouTubeIcon = (props: React.ComponentProps<'svg'>) => (
  <BrandSvg {...props}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="m10.2 9.4 4.6 2.6-4.6 2.6z" fill="currentColor" stroke="none" />
  </BrandSvg>
);
