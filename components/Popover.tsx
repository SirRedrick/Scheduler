"use client";

import * as React from "react";
import type { Placement } from "@floating-ui/react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingFocusManager,
  FloatingPortal,
} from "@floating-ui/react";
import { twMerge } from "tailwind-merge";
import { useControlledState } from "../hooks/useControlledState";

type UsePopoverOptions = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  modal?: boolean;
};

export function usePopover({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange: setControlledOpen,
  placement = "top",
  modal = true,
}: UsePopoverOptions) {
  const [open, setOpen] = useControlledState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: setControlledOpen,
  });
  const [labelId, setLabelId] = React.useState<string | undefined>();
  const [descriptionId, setDescriptionId] = React.useState<
    string | undefined
  >();

  const data = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({ fallbackAxisSideDirection: "end" }),
      shift({ padding: 5 }),
    ],
  });

  const context = data.context;

  const click = useClick(context, {
    enabled: !controlledOpen,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      modal,
      labelId,
      setLabelId,
      descriptionId,
      setDescriptionId,
    }),
    [open, setOpen, interactions, data, modal, labelId, descriptionId]
  );
}

const PopoverContext = React.createContext<ReturnType<
  typeof usePopover
> | null>(null);

export function usePopoverState() {
  const context = React.useContext(PopoverContext);

  if (context === null) {
    throw new Error("Popover components must be wrapped in <Popover />");
  }

  return context;
}

export function Popover({
  children,
  ...options
}: UsePopoverOptions & { children: React.ReactNode }) {
  const popover = usePopover(options);

  return (
    <PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>
  );
}

export const PopoverTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & { asChild?: boolean }
>(function PopoverTrigger({ children, asChild = false, ...props }, propsRef) {
  const state = usePopoverState();
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

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>(function PopoverContent({ style, className, ...props }, propsRef) {
  const state = usePopoverState();
  const ref = useMergeRefs([state.floating, propsRef]);

  return (
    <FloatingPortal>
      {state.open && (
        <FloatingFocusManager context={state.context} modal={state.modal}>
          <div
            ref={ref}
            style={{
              position: state.strategy,
              top: state.y ?? 0,
              left: state.x ?? 0,
              ...style,
            }}
            className={twMerge(
              "w-max max-w-[calc(100vw_-_10px)] rounded bg-slate-3 py-1 px-4 shadow dark:bg-slate-dark-3",
              className
            )}
            aria-labelledby={state.labelId}
            aria-describedby={state.descriptionId}
            {...state.getFloatingProps(props)}
          />
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
});

export const PopoverHeading = React.forwardRef<
  HTMLHeadingElement,
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
>(function PopoverHeading(props, ref) {
  const { setLabelId } = usePopoverState();
  const id = React.useId();

  React.useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return <h2 ref={ref} id={id} {...props} />;
});

export const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >
>(function PopoverDescription(props, ref) {
  const { setDescriptionId } = usePopoverState();
  const id = React.useId();

  React.useLayoutEffect(() => {
    setDescriptionId(id);
    () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  return <p ref={ref} id={id} {...props} />;
});

export const PopoverClose = React.forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>(function PopoverClose(props, ref) {
  const state = usePopoverState();

  return <button ref={ref} onClick={() => state.setOpen(false)} {...props} />;
});
