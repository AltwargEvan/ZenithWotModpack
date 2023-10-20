import { Tables } from "@zenith/utils/apitypes";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/layouts/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { stringToHslColor } from "@/lib/utils/stringToHslColor";
import { useIsStreaming, useStreamers } from "@/api/supabase/streamers";

const StreamerItem = ({ streamer }: { streamer: Tables<"streamers"> }) => {
  const { data: isStreaming } = useIsStreaming(streamer.twitchUsername);
  const twitchUrl = `https://www.twitch.tv/${streamer.twitchUsername}`;
  return (
    <div
      style={{
        backgroundImage: `url(${streamer.bannerUrl})`,
        backgroundColor: streamer.bannerUrl
          ? undefined
          : streamer.bannerColor || stringToHslColor(streamer.twitchUsername),
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="h-20 bg-neutral-700 hover:bg-neutral-600 shadow select-none rounded border overflow-hidden my-2 mr-3"
    >
      <div className="p-4 flex justify-between items-center">
        <a
          target="_blank"
          href={twitchUrl}
          className="flex items-center space-x-2 w-min"
        >
          <img
            src={streamer.avatarUrl || undefined}
            className="h-11 w-11 rounded"
          />
          <div className="flex">
            <span className="font-medium text-lg">
              {streamer.twitchUsername}
            </span>
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
        {/* <InstallButton modIds={streamer.mods} /> */}
      </div>
    </div>
  );
};

const StreamersPage = () => {
  const { data, error, isLoading } = useStreamers();
  if (error) return "Failed to fetch streamers";
  return (
    <>
      <PageHeader
        title="Streamers"
        subtext="Download the up to date mods that your favorite streamer is using."
      />
      <ScrollArea className="grid w-full overflow-y-auto gap-4">
        {isLoading &&
          [1, 2, 3, 4, 5].map((_, i) => (
            <Skeleton className="h-20 rounded  my-2 mr-3" key={i} />
          ))}
        {data &&
          data.map((streamer) => (
            <StreamerItem streamer={streamer} key={streamer.id} />
          ))}
      </ScrollArea>
    </>
  );
};

export default StreamersPage;
