import { Heading, Text } from "@/components/ui";

interface ProcessStepProps {
  index: number;
  title: string;
  description: string;
}

export function ProcessStep({ index, title, description }: ProcessStepProps) {
  return (
    <div
      className="
        relative
        h-full
        min-h-[220px]
        bg-surface
        p-6
        md:p-8
        lg:min-h-[240px] lg:p-10
      "
    >
      <div className="flex h-full flex-col justify-between gap-10">
        <div className="shrink-0">
          <span
            className="
              flex h-9 w-9 items-center justify-center
              border border-border-strong
              bg-background
              font-mono text-[0.6875rem] font-semibold
              tracking-[0.04em]
              text-signal-strong
            "
          >
            {String(index).padStart(2, "0")}
          </span>
        </div>

        <div className="max-w-md">
          <Heading as="h3">
            {title}
          </Heading>

          <Text
            variant="muted"
            className="mt-3 leading-relaxed text-text-secondary"
          >
            {description}
          </Text>
        </div>
      </div>
    </div>
  );
}
