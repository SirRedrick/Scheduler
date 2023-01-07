"use client";

import * as React from "react";
import type { Placement } from "@floating-ui/react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
} from "@floating-ui/react";
import { useControlledState } from "../hooks/useControlledState";
import { twMerge } from "tailwind-merge";

type UseTooltipOptions = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
};

export function useTooltip({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange: setControlledOpen,
  placement = "top",
}: UseTooltipOptions) {
  const [open, setOpen] = useControlledState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: setControlledOpen,
  });

  const data = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: "start",
        crossAxis: placement.includes("-"),
      }),
      shift({ padding: 5 }),
    ],
  });

  const context = data.context;

  const hover = useHover(context, {
    move: false,
    enabled: !controlledOpen,
  });
  const focus = useFocus(context, {
    enabled: !controlledOpen,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return React.useMemo(
    () => ({ open, setOpen, ...interactions, ...data }),
    [open, setOpen, interactions, data]
  );
}

const TooltipContext = React.createContext<ReturnType<
  typeof useTooltip
> | null>(null);

export const useTooltipState = () => {
  const context = React.useContext(TooltipContext);

  if (context === null) {
    throw new Error("Tooltip components must be wrapped in <Tooltip />");
  }

  return context;
};

export function Tooltip({
  children,
  ...options
}: UseTooltipOptions & { children: React.ReactNode }) {
  const tooltip = useTooltip(options);

  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
}

export const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & { asChild?: boolean }
>(function TooltipTrigger({ children, asChild = false, ...props }, propsRef) {
  const state = useTooltipState();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([state.reference, propsRef, childrenRef]);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      state.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        "data-state": state.open ? "open" : "closed",
      })
    );
  }

  return (
    <button
      ref={ref}
      data-state={state.open ? "open" : "closed"}
      {...state.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>(function TooltipContent({ style, className, ...props }, propsRef) {
  const state = useTooltipState();
  const ref = useMergeRefs([state.floating, propsRef]);

  return (
    <FloatingPortal>
      {state.open && (
        <div
          ref={ref}
          style={{
            position: state.strategy,
            top: state.y ?? 0,
            left: state.x ?? 0,
            visibility: state.x === null ? "hidden" : "visible",
            ...style,
          }}
          className={twMerge(
            "w-max max-w-[calc(100vw_-_10px)] rounded bg-slate-3 py-1 px-4 shadow dark:bg-slate-dark-3",
            className
          )}
          {...state.getFloatingProps(props)}
        />
      )}
    </FloatingPortal>
  );
});
