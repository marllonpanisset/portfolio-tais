import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => <h2 className="mt-10 font-display text-[1.5rem] font-medium leading-[1.25] text-text-primary sm:mt-12 sm:text-[1.75rem]" {...props} />,
    h3: (props) => <h3 className="mt-8 font-display text-[1.25rem] font-medium leading-[1.3] text-text-primary sm:text-[1.375rem]" {...props} />,
    p: (props) => <p className="mt-5 text-[1rem] leading-7 text-text-secondary sm:text-[1.0625rem] sm:leading-8" {...props} />,
    ul: (props) => <ul className="mt-5 flex flex-col gap-2 pl-5 text-text-secondary marker:text-signal-strong list-disc" {...props} />,
    a: (props) => (
      <a
        className="break-words text-signal-strong underline underline-offset-4 [overflow-wrap:anywhere]"
        {...props}
      />
    ),
    strong: (props) => <strong className="text-text-primary" {...props} />,
    code: (props) => (
      <code
        className="break-words rounded-[4px] bg-surface-elevated px-1.5 py-0.5 font-mono text-[0.875rem] [overflow-wrap:anywhere]"
        {...props}
      />
    ),
    ...components,
  };
}
