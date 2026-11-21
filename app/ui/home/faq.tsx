import { RiAddLine, RiSubtractLine } from '@remixicon/react';

export default function Faq({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="mx-auto w-full max-w-180 border-t border-neutral-100">
      {items.map((item, index) => (
        <details
          key={item.question}
          name="faq"
          open={index === 0}
          className="group border-b border-neutral-100 py-5"
        >
          <summary className="text-subtitle-m flex cursor-pointer list-none items-center gap-4 text-neutral-900 [&::-webkit-details-marker]:hidden">
            <span className="flex-1">{item.question}</span>
            <RiAddLine
              aria-hidden
              className="size-6 shrink-0 group-open:hidden"
            />
            <RiSubtractLine
              aria-hidden
              className="hidden size-6 shrink-0 group-open:block"
            />
          </summary>
          <p className="text-body-m mt-3 text-neutral-800">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
