type CompanyLogoProps = {
  name: string;
  logoUrl?: string;
  color?: string;
  className?: string;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toLocaleUpperCase("tr-TR"))
    .join("");
}

export function CompanyLogo({ name, logoUrl, color = "#405574", className = "" }: CompanyLogoProps) {
  return (
    <span
      className={`company-logo ${className}`.trim()}
      style={logoUrl ? undefined : { backgroundColor: color }}
      role="img"
      aria-label={`${name} logosu`}
    >
      {logoUrl ? <img src={logoUrl} alt="" /> : <span aria-hidden="true">{getInitials(name)}</span>}
    </span>
  );
}
