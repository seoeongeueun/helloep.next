import dynamic from "next/dynamic";
import { ExpandButton } from "@/ui";

const DynamicContent = dynamic(() => import("./Content"), {
  ssr: true,
});

export default function SideBar() {
  return (
    <aside className="sticky top-0 font-normal min-w-[40rem] w-[29%] border-l border-px border-gray">
      <header className="flex flex-row px-margin w-full justify-end items-center gap-spacing-10 h-headerH border-b border-px border-gray text-m">
        <ExpandButton />
        <button type="button" aria-label="Contact">
          Contact
        </button>
        <button type="button" aria-label="CV">
          CV
        </button>
        <button type="button" aria-label="Client">
          Client
        </button>
      </header>
      <section className="relative flex flex-col justify-end gap-12 p-margin h-[calc(100%_-_var(--headerH))] overflow-hidden">
        <DynamicContent />
      </section>
    </aside>
  );
}
