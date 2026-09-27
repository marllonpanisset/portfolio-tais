import { Text } from "@/components/ui";

interface Stat {
  value: string;
  label: string;
}

export function StatsBlock({ stats }: { stats: Stat[] }) {
  return (
    <div
      className="
        grid grid-cols-2 gap-px
        border-b border-border/70
        bg-border/70
        md:grid-cols-4
      "
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="
            h-full
            bg-background/95 px-5 py-7
            transition-colors duration-200
            ease-[var(--ease-signature)]
            hover:bg-surface/70
            sm:px-6
            md:px-8 md:py-9
          "
        >
          <p
            className="
              font-mono
              text-[clamp(1.75rem,3vw,2.375rem)]
              leading-none tracking-[-0.055em]
              text-signal-strong
            "
          >
            {stat.value}
          </p>

          <Text
            variant="muted"
            className="mt-4 max-w-[13rem] text-sm leading-snug text-text-secondary"
          >
            {stat.label}
          </Text>
        </div>
      ))}
    </div>
  );
}
