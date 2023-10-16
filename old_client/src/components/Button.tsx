type Props = {} & React.ButtonHTMLAttributes<HTMLButtonElement>;
import { twMerge } from "tailwind-merge";

const Button = ({ className, children, ...props }: Props) => {
  const mergedClassName = twMerge(
    className,
    "bg-primary-500 hover:bg-primary-600 hover:cursor-pointer"
  );
  return (
    <button {...props} className={mergedClassName}>
      {children}
    </button>
  );
};

export default Button;
