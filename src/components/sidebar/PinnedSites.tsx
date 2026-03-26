import { useTabStore } from "@/stores/tabStore";
import { TabItem } from "./TabItem";

export function PinnedSites(): JSX.Element {
  const pinnedTabs = useTabStore((s) => s.pinnedTabs);

  if (pinnedTabs.length === 0) return <></>;

  return (
    <div className="flex flex-col px-1 py-1">
      {pinnedTabs.map((tab) => (
        <TabItem key={tab.id} tab={tab} />
      ))}
    </div>
  );
}
