import { WifiOff } from "lucide-react";
import { Block } from "konsta/react";

export function OfflineIndicator() {
  return (
    <Block className="mx-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
      <WifiOff className="h-4 w-4 text-yellow-700 flex-shrink-0" />
      <p className="text-sm text-yellow-800 font-medium">
        Offline - Updates paused
      </p>
    </Block>
  );
}
