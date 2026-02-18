import CardList from "@/components/CardList";
import { Filters } from "@/ui";

export default function Home() {
  return (
    <div
      id="main-scroll"
      className="flex flex-col border-r border-px border-gray w-full h-full overflow-y-auto"
    >
      <Filters />
      <CardList />
    </div>
  );
}
