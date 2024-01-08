import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";
import { Button as ReactAriaButton, ButtonProps as ReactAriaButtonProps } from "react-aria-components";
import { useFocusRing } from "react-aria";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors disabled:pointer-events-none disabled:opacity-70",
	{
		variants: {
			variant: {
				default: "bg-[#1A1818] text-[#FBFBFB]",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, size, variant, ...props }, ref) => {
	return <button type="button" className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button };
