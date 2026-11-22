import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "water"
  | "pin"
  | "route"
  | "shelter"
  | "alert"
  | "phone"
  | "box"
  | "clock"
  | "check"
  | "close"
  | "car"
  | "boat"
  | "menu"
  | "search"
  | "arrow"
  | "rain";

const paths: Record<IconName, ReactNode> = {
  water: <><path d="M3 8c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2M2 13c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M4 18c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" /></>,
  pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  route: <><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" /><path d="M8.5 18H11a3 3 0 0 0 3-3v-2a3 3 0 0 1 3-3h1" /></>,
  shelter: <><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z" /><path d="M9 11h6" /></>,
  alert: <><path d="m12 3 10 18H2L12 3Z" /><path d="M12 9v5m0 3h.01" /></>,
  phone: <><path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M10 18h4" /></>,
  box: <><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 5v9l9 5 9-5V8m-9 5v9" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  car: <><path d="m5 11 2-5h10l2 5 2 2v5h-2v-2H5v2H3v-5l2-2Zm1 0h12M7 14h.01M17 14h.01" /></>,
  boat: <><path d="m3 15 2 4h14l2-4-9 2-9-2Zm9 2V4m0 2 5 7h-5M12 7 7 14h5" /></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
  arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
  rain: <><path d="M20 15.5a4.5 4.5 0 0 0-1-8.9A6 6 0 0 0 7.4 8 4 4 0 0 0 7 16" /><path d="m8 19-1 2m6-2-1 2m6-2-1 2" /></>,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={`icon${className ? ` ${className}` : ""}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
