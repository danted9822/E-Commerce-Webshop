import { alpha, InputBaseComponentProps, useTheme } from '@mui/material';
import { forwardRef, Ref, useImperativeHandle, useRef } from 'react';
 
export const StripeInput = forwardRef(function StripeInput(
  { component: Compononent, options, ...props }: InputBaseComponentProps,
  ref: Ref<unknown>
) {
  const theme = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const elementRef = useRef<any>();
  useImperativeHandle(ref, () => ({
    focus: () => elementRef.current.focus,
  }));
  return (
    <Compononent
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onReady={(element: any) => (elementRef.current = element)}
      options={{
        ...options,
        style: {
          base: {
            color: theme.palette.text.primary,
            fontSize: `${theme.typography.fontSize}px`,
            fontFamily: theme.typography.fontFamily,
            '::placeholder': {
              color: alpha(theme.palette.text.primary, 0.42),
            },
          },
          invalid: {
            color: theme.palette.text.primary,
          },
        },
      }}
      {...props}
    />
  );
});