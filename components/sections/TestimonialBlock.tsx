import { Card, Text } from "@/components/ui";

interface TestimonialBlockProps {
  quote: string;
  author: string;
  role: string;
}

export function TestimonialBlock({ quote, author, role }: TestimonialBlockProps) {
  return (
    <Card className="max-w-2xl">
      <Text variant="lead" className="text-text-primary">
        “{quote}”
      </Text>
      <div className="mt-6">
        <Text variant="body" className="font-medium text-text-primary">
          {author}
        </Text>
        <Text variant="muted">{role}</Text>
      </div>
    </Card>
  );
}
