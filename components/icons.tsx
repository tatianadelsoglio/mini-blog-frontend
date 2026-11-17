import type { SVGProps } from "react";

// Íconos del diseño (design/cuaderno.pen): Lucide para la interfaz (trazo) y
// los logos de Phosphor (relleno, exportados del .pen) para GitHub y LinkedIn.
// Son decorativos por defecto (aria-hidden): el nombre accesible lo da el
// control que los contiene.

type IconProps = Omit<SVGProps<SVGSVGElement>, "children">;

function LucideIcon({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
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

export const MoonIcon = (props: IconProps) => (
  <LucideIcon {...props}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </LucideIcon>
);

export const SunIcon = (props: IconProps) => (
  <LucideIcon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </LucideIcon>
);

export const MenuIcon = (props: IconProps) => (
  <LucideIcon {...props}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </LucideIcon>
);

export const CloseIcon = (props: IconProps) => (
  <LucideIcon {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </LucideIcon>
);

export const SearchIcon = (props: IconProps) => (
  <LucideIcon {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </LucideIcon>
);

export const SearchXIcon = (props: IconProps) => (
  <LucideIcon {...props}>
    <path d="m13.5 8.5-5 5M8.5 8.5l5 5" />
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </LucideIcon>
);

export const ArrowRightIcon = (props: IconProps) => (
  <LucideIcon {...props}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </LucideIcon>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <LucideIcon {...props}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </LucideIcon>
);

export const ArrowUpRightIcon = (props: IconProps) => (
  <LucideIcon {...props}>
    <path d="M7 7h10v10M7 17 17 7" />
  </LucideIcon>
);

export const CopyIcon = (props: IconProps) => (
  <LucideIcon {...props}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </LucideIcon>
);

export const CheckIcon = (props: IconProps) => (
  <LucideIcon {...props}>
    <path d="M20 6 9 17l-5-5" />
  </LucideIcon>
);

export const RotateCcwIcon = (props: IconProps) => (
  <LucideIcon {...props}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </LucideIcon>
);

export const CloudOffIcon = (props: IconProps) => (
  <LucideIcon {...props}>
    <path d="m2 2 20 20" />
    <path d="M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193" />
    <path d="M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07" />
  </LucideIcon>
);

function BrandIcon({ d, ...props }: IconProps & { d: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={d} />
    </svg>
  );
}

const GITHUB_PATH =
  "M16.875 16.875q-.547 0-.898-.352-.352-.351-.352-.898v-.625q0-.625-.312-1.211-.313-.586-.86-.898 .86-.625 1.328-1.563 .469-.937 .469-1.953v-.625q0-1.172-.625-2.187 .313-.938 .195-1.915-.117-.976-.586-1.835-.156-.313-.546-.313-1.094 0-2.11 .508-1.015 .508-1.64 1.367h-1.875q-.625-.859-1.641-1.367-1.016-.508-2.109-.508-.391 0-.547 .313-.469 .859-.586 1.835-.117 .977 .195 1.915-.625 1.015-.625 2.187v.625q0 1.016 .469 1.953 .469 .938 1.328 1.563-.547 .312-.859 .898-.313 .586-.313 1.211v.625q0 .547-.352 .898-.351 .352-.898 .352-.234 0-.43 .195-.195 .196-.195 .43 0 .234 .195 .43 .196 .195 .43 .195 1.016 0 1.758-.742 .742-.742 .742-1.758v-.625q0-.547 .352-.898 .351-.352 .898-.352h.938v3.125q0 .547-.352 .898-.352 .352-.898 .352-.235 0-.43 .195-.195 .196-.195 .43 0 .234 .195 .43 .195 .195 .43 .195 1.015 0 1.757-.742 .743-.742 .743-1.758v-3.125h1.875v3.125q0 1.016 .742 1.758 .742 .742 1.758 .742 .234 0 .429-.195 .196-.196 .196-.43 0-.234-.196-.43-.195-.195-.429-.195-.547 0-.899-.352-.351-.351-.351-.898v-3.125h.937q.547 0 .898 .352 .352 .351 .352 .898v.625q0 1.016 .742 1.758 .742 .742 1.758 .742 .234 0 .43-.195 .195-.196 .195-.43 0-.234-.195-.43-.196-.195-.43-.195zM5 9.375v-.625q0-.937 .547-1.797 .234-.234 .078-.547-.547-1.328 .078-2.656 .781 .078 1.445 .508 .665 .43 1.055 1.055 .156 .312 .547 .312h2.5q.391 0 .547-.312 .391-.625 1.055-1.055 .664-.43 1.445-.508 .625 1.328 .078 2.656-.156 .313 .078 .547 .547 .86 .547 1.797v.625q0 1.328-.898 2.227-.899 .898-2.227 .898h-3.75q-1.328 0-2.227-.898-.898-.899-.898-2.227z";

const LINKEDIN_PATH =
  "M7.813 6.25q0 .391-.274 .664-.273 .274-.664 .274-.391 0-.664-.274-.273-.273-.273-.664 0-.391 .273-.664 .273-.273 .664-.273 .391 0 .664 .273 .274 .273 .274 .664zM17.813 3.438v13.125q0 .546-.352 .898-.352 .352-.898 .352h-13.125q-.547 0-.899-.352-.351-.352-.351-.898v-13.125q0-.547 .351-.899 .352-.351 .899-.351h13.125q.546 0 .898 .351 .352 .352 .352 .899zM16.563 16.563v-13.125h-13.125v13.125zM6.875 8.125q-.234 0-.43 .195-.195 .196-.195 .43v5q0 .234 .195 .43 .196 .195 .43 .195 .234 0 .43-.195 .195-.196 .195-.43v-5q0-.234-.195-.43-.196-.195-.43-.195zM11.563 8.125q-.86 0-1.563 .469-.078-.235-.273-.352-.196-.117-.43-.117-.234 0-.391 .195-.156 .196-.156 .43v5q0 .234 .195 .43 .196 .195 .43 .195 .234 0 .43-.195 .195-.196 .195-.43v-2.812q0-.625 .469-1.094 .469-.469 1.094-.469 .625 0 1.093 .469 .469 .469 .469 1.094v2.812q0 .234 .195 .43 .196 .195 .43 .195 .234 0 .43-.195 .195-.196 .195-.43v-2.812q0-1.172-.82-1.993-.821-.82-1.992-.82z";

export const GitHubIcon = (props: IconProps) => <BrandIcon d={GITHUB_PATH} {...props} />;

export const LinkedInIcon = (props: IconProps) => <BrandIcon d={LINKEDIN_PATH} {...props} />;
