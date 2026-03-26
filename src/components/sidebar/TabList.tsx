import { useTabStore } from "@/stores/tabStore";
import { TabItem } from "./TabItem";

export function TabList(): JSX.Element {
  const tabs = useTabStore((s) => s.tabs);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-1 py-1">
      {tabs.map((tab) => (
        <TabItem key={tab.id} tab={tab} />
      ))}
    </div>
  );
}
