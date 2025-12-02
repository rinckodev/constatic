export function VSCodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      color={props.color??"#2196F3"}
    >
      <g clipPath="url(#clip0_346_218)">
        <path
          d="M25.1463 0L11.4286 12.9177L3.24571 6.85714L0 9.14286L7.73943 16L0 22.8571L3.24571 25.1429L11.4286 19.088L25.1463 32L32 28.6709V3.32914L25.1463 0ZM25.1429 8.496V23.504L15.1874 16L25.1429 8.496Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_346_218">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}