import * as React from "react";

type UseControlledStateOptions<TValue> = {
  value?: TValue;
  defaultValue?: TValue;
  onChange?: (value: TValue) => void;
};

export function useControlledState<TValue>({
  value: controlledState,
  defaultValue,
  onChange: setControlledState,
}: UseControlledStateOptions<TValue>) {
  const [uncontrolledState, setUncontrolledState] =
    React.useState(defaultValue);

  return [
    controlledState ?? uncontrolledState,
    setControlledState ?? setUncontrolledState,
  ] as const;
}
