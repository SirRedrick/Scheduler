"use client";

import * as React from "react";
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  FloatingOverlay,
  FloatingFocusManager,
} from "@floating-ui/react";
import { useControlledState } from "../hooks/useControlledState";

type UseDialogOptions = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
};

export function useDialog({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange: setControlledOpen,
  modal = true,
}: UseDialogOptions) {
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
  });

  const context = data.context;

  const click = useClick(context, {
    enabled: !controlledOpen,
  });
  const dismiss = useDismiss(context, { outsidePressEvent: "pointerdown" });
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

const DialogContext = React.createContext<ReturnType<typeof useDialog> | null>(
  null
);

export function useDialogState() {
  const context = React.useContext(DialogContext);

  if (context === null) {
    throw new Error("Dialog components must be wrapped in <Dialog />");
  }

  return context;
}

export function Dialog({
  children,
  ...options
}: UseDialogOptions & { children: React.ReactNode }) {
  const dialog = useDialog(options);

  return (
    <DialogContext.Provider value={dialog}>{children}</DialogContext.Provider>
  );
}

export const DialogTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & {
    children: React.ReactNode;
    asChild?: boolean;
  }
>(function DialogTrigger({ children, asChild = false, ...props }, propsRef) {
  const state = useDialogState();
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

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>(function DialogContent(props, propsRef) {
  const state = useDialogState();
  const ref = useMergeRefs([state.floating, propsRef]);

  return (
    <FloatingPortal>
      {state.open && (
        <FloatingOverlay
          className="grid place-items-center bg-black/80"
          lockScroll
        >
          <FloatingFocusManager context={state.context} modal={state.modal}>
            <div
              ref={ref}
              aria-labelledby={state.labelId}
              aria-describedby={state.descriptionId}
              {...state.getFloatingProps(props)}
            />
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </FloatingPortal>
  );
});

export const DialogHeading = React.forwardRef<
  HTMLHeadingElement,
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
>(function DialogHeading(props, ref) {
  const { setLabelId } = useDialogState();
  const id = React.useId();

  React.useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return <h2 ref={ref} id={id} {...props} />;
});

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >
>(function DialogDescription(props, ref) {
  const { setDescriptionId } = useDialogState();
  const id = React.useId();

  React.useLayoutEffect(() => {
    setDescriptionId(id);
    () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  return <p ref={ref} id={id} {...props} />;
});

export const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>(function DialogClose(props, ref) {
  const { setOpen } = useDialogState();

  return <button ref={ref} onClick={() => setOpen(false)} {...props} />;
});
