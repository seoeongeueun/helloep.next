import Card from "./Card";
import { SearchBar } from "../ui";

export default function CardList() {
  return (
    <main className="relative top-30 px-margin flex flex-col">
      <SearchBar />
      <section className="grid grid-cols-4 gap-spacing-10 py-[5rem]">
        {Array.from({ length: 7 }, (_, i) => (
          <Card key={i} />
        ))}
      </section>
    </main>
  );
}
