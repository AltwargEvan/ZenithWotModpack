import { Separator } from "@/components/ui/separator";
const PageHeader = ({
  title,
  subtext,
}: {
  title?: string;
  subtext?: string;
}) => {
  return (
    <>
      <div className="h-[5.25rem] w-full pt-4 space-y-1">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{subtext}</p>
      </div>
      <Separator />
    </>
  );
};

export default PageHeader;
