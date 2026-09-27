"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Text } from "@/components/ui";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="group flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="text-[1rem] font-medium text-text-primary transition-colors group-hover:text-signal-strong">{item.question}</span>
              <ChevronDown
                size={18}
                className={cn("shrink-0 text-text-muted transition-transform duration-200", isOpen && "rotate-180")}
              />
            </button>
            {isOpen && (
              <div className="pb-5">
                <Text variant="muted">{item.answer}</Text>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
