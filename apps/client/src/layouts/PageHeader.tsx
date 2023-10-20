import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";
const PageHeader = ({
  title,
  subtext,
  action,
}: {
  title?: ReactNode;
  subtext?: ReactNode;
  action?: ReactNode;
}) => {
  return (
    <>
      <div className="h-[5.4rem] w-full pt-4 space-y-1">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {action}
        </div>
        <div className="text-muted-foreground h-7">{subtext}</div>
      </div>
      <Separator />
    </>
  );
};

export default PageHeader;
