export function ReadmeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      color={props.color??"#42A5F5"}
    >
      <path
        d="M16 0C7.168 0 0 7.168 0 16C0 24.832 7.168 32 16 32C24.832 32 32 24.832 32 16C32 7.168 24.832 0 16 0ZM18.2857 25.1429H13.7143V14.8571H18.2857V25.1429ZM18.2857 11.4286H13.7143V6.85714H18.2857V11.4286Z"
        fill="currentColor"
      />
    </svg>
  );
}