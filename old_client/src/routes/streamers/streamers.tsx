import { useLayout } from "../../stores/rootLayoutStore";

import { StreamerData, useIsStreaming, useStreamers } from "@/api";
import { InstallButton } from "./installButton";

const StreamerItem = ({ streamer }: { streamer: StreamerData }) => {
  const { data: isStreaming } = useIsStreaming(streamer.name);
  return (
    <div
      style={{
        backgroundImage: `url(${streamer.banner})`,
        backgroundColor: streamer.banner,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="h-18 bg-neutral-700 hover:bg-neutral-600 shadow select-none rounded border"
    >
      <div className="p-4 flex justify-between items-center">
        <a
          target="_blank"
          href={streamer.twitchUrl}
          className="flex items-center space-x-2 w-min"
        >
          <img src={streamer.logoUrl} className="h-11 w-11 rounded" />
          <div className="flex">
            <span className="font-medium text-lg">{streamer.name}</span>
          </div>
          {isStreaming && (
            <div
              className="px-2 bg-red-600 rounded-sm pt-1"
              style={{ boxShadow: "-3px 3px black" }}
            >
              LIVE
            </div>
          )}
        </a>
        <InstallButton modIds={streamer.mods} />
      </div>
    </div>
  );
};

const StreamersPage = () => {
  useLayout("Streamers");
  const { data } = useStreamers();
  console.log(data);
  return (
    <div className="px-3">
      <div
        style={{
          maxHeight: "calc(100vh - 138px)",
        }}
        className="grid w-full overflow-y-auto  space-y-2"
      >
        {data?.map((streamer) => (
          <StreamerItem streamer={streamer} key={streamer.name} />
        ))}
      </div>
    </div>
  );
};

export default StreamersPage;
