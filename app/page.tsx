import CardList from "@/components/CardList";
import { Header, Filters } from "@/ui";

export default function Home() {
  return (
    <div className="flex flex-col border-r border-px border-gray w-full h-full overflow-y-auto">
      <Header />
      <Filters />
      <CardList />
    </div>
  );
}
