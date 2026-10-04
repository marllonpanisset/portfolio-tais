"use client";

import { useId } from "react";
import {
  siBehance,
  siInstagram,
  siLinkedin,
  siLinktree,
  siWhatsapp,
  siYoutube,
} from "simple-icons";

import type { SiteSettingKey, SiteSettings } from "@/lib/cms/site-settings";

const BRAND_OVERLAY: Record<SiteSettingKey, { color?: string; gradient?: string[] }> = {
  instagram: {
    gradient: ["#FEDA75", "#FA7E1E", "#D62976", "#962FBF", "#4F5BD5"],
  },
  youtube: { color: "#FF0000" },
  linkedin: { color: "#0A66C2" },
  whatsapp: { color: "#25D366" },
  behance: { color: "#1769FF" },
  linktree: { color: "#43E660" },
};

const SOCIAL_CHANNELS: Array<{
  key: SiteSettingKey;
  label: string;
  icon: { title: string; path: string };
}> = [
  { key: "instagram", label: "Instagram", icon: siInstagram },
  { key: "youtube", label: "YouTube", icon: siYoutube },
  { key: "linkedin", label: "LinkedIn", icon: siLinkedin },
  { key: "whatsapp", label: "WhatsApp", icon: siWhatsapp },
  { key: "behance", label: "Behance", icon: siBehance },
  { key: "linktree", label: "Linktree", icon: siLinktree },
];

export function SocialLinks({
  settings,
  iconClassName,
}: {
  settings: SiteSettings | null | undefined;
  iconClassName?: string;
}) {
  const channels = SOCIAL_CHANNELS.flatMap((item) => {
    const url = settings?.[item.key];
    return typeof url === "string" && url.trim().length > 0
      ? [{ ...item, url }]
      : [];
  });

  if (channels.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {channels.map(({ key, label, icon, url }) => (
        <li key={key}>
          <ChannelLink href={url} label={label} channelKey={key} path={icon.path} iconClassName={iconClassName} />
        </li>
      ))}
    </ul>
  );
}

function ChannelLink({
  href,
  label,
  channelKey,
  path,
  iconClassName,
}: {
  href: string;
  label: string;
  channelKey: SiteSettingKey;
  path: string;
  iconClassName?: string;
}) {
  const gradientId = useId();
  const brand = BRAND_OVERLAY[channelKey];

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group block text-black/65"
    >
      <svg
        role="img"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={iconClassName}
        aria-hidden="true"
      >
        <path d={path} />
        {brand.gradient ? (
          <>
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
                {brand.gradient.map((stop, index) => (
                  <stop
                    key={stop}
                    offset={`${(index / (brand.gradient!.length - 1)) * 100}%`}
                    stopColor={stop}
                  />
                ))}
              </linearGradient>
            </defs>
            <path
              d={path}
              fill={`url(#${gradientId})`}
              className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            />
          </>
        ) : (
          <path
            d={path}
            fill={brand.color}
            className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          />
        )}
      </svg>
    </a>
  );
}
