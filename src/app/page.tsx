import { getSeaLevelData } from "@/data/parser";
import InteractiveApp from "@/components/InteractiveApp";

export default function Home() {
  const { raw, derived } = getSeaLevelData();

  return <InteractiveApp raw={raw} derived={derived} />;
}
