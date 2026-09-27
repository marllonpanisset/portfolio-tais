import { Check } from "lucide-react";
import { Grid, Text } from "@/components/ui";

export function FeatureGrid({ items, cols = 2 }: { items: string[]; cols?: 2 | 3 }) {
  return (
    <Grid cols={cols}>
      {items.map((item) => (
        <div key={item} className="flex min-w-0 items-start gap-3">
          <Check size={18} className="mt-0.5 shrink-0 text-signal-strong" />
          <Text variant="body" className="min-w-0">
            {item}
          </Text>
        </div>
      ))}
    </Grid>
  );
}
