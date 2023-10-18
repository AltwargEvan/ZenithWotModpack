import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";
const PageHeader = ({
  title,
  subtext,
  action,
}: {
  title?: string;
  subtext?: ReactNode;
  action?: ReactNode;
}) => {
  return (
    <>
      <div className="h-[5.25rem] w-full pt-4 space-y-1">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {action}
        </div>
        <p className="text-muted-foreground">{subtext}</p>
      </div>
      <Separator />
    </>
  );
};

export default PageHeader;
