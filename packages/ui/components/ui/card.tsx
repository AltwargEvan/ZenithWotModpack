<<<<<<< HEAD
import * as React from "react"

import { cn } from "@ui/lib/utils"
=======
import * as React from "react";

import { cn } from "@ui/lib/utils";
>>>>>>> 198093ed6a3a6b64c0542992bc85ce6efc00fc1a

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
<<<<<<< HEAD
      "rounded-lg border bg-card text-card-foreground shadow-sm",
=======
      "rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50",
>>>>>>> 198093ed6a3a6b64c0542992bc85ce6efc00fc1a
      className
    )}
    {...props}
  />
<<<<<<< HEAD
))
Card.displayName = "Card"
=======
));
Card.displayName = "Card";
>>>>>>> 198093ed6a3a6b64c0542992bc85ce6efc00fc1a

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
<<<<<<< HEAD
))
CardHeader.displayName = "CardHeader"
=======
));
CardHeader.displayName = "CardHeader";
>>>>>>> 198093ed6a3a6b64c0542992bc85ce6efc00fc1a

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
<<<<<<< HEAD
))
CardTitle.displayName = "CardTitle"
=======
));
CardTitle.displayName = "CardTitle";
>>>>>>> 198093ed6a3a6b64c0542992bc85ce6efc00fc1a

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
<<<<<<< HEAD
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"
=======
    className={cn("text-sm text-neutral-500 dark:text-neutral-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";
>>>>>>> 198093ed6a3a6b64c0542992bc85ce6efc00fc1a

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
<<<<<<< HEAD
))
CardContent.displayName = "CardContent"
=======
));
CardContent.displayName = "CardContent";
>>>>>>> 198093ed6a3a6b64c0542992bc85ce6efc00fc1a

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
<<<<<<< HEAD
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
=======
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
>>>>>>> 198093ed6a3a6b64c0542992bc85ce6efc00fc1a
