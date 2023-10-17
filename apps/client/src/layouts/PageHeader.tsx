const PageHeader = ({
  title,
  backgroundImage,
}: {
  title: string;
  backgroundImage?: string;
}) => {
  return (
    <div className="h-12 w-full px-3 pb-2">
      <span className="text-3xl font-bold">{title}</span>
    </div>
  );
};

export default PageHeader;
