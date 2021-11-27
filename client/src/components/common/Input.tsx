import {
  InputBaseComponentProps,
  OutlinedInputProps,
  TextField,
  Theme,
} from "@mui/material";
import { SxProps } from "@mui/system";

interface InputPropsI {
  name?: string;
  label: React.ReactNode;
  value: unknown;
  placeholder: string;
  required?: boolean;
  multiline?: boolean;
  InputProps?: Partial<OutlinedInputProps>;
  rows?: number;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  error?: string;
  type?: React.HTMLInputTypeAttribute;
  sx?: SxProps<Theme>;
  defaultValue?: unknown;
  inputProps?: InputBaseComponentProps;
  onKeyPress?: React.KeyboardEventHandler<HTMLDivElement>;
  notFullWidth?: boolean;
}

const Input = (props: InputPropsI): JSX.Element => {
  return (
    <TextField
      onKeyPress={props.onKeyPress}
      defaultValue={props.defaultValue}
      type={props.type}
      label={props.label}
      inputProps={props.inputProps}
      InputProps={props.InputProps}
      value={props.value}
      placeholder={props.placeholder}
      sx={props.sx}
      multiline={props.multiline}
      rows={props.rows}
      onChange={props.onChange}
      name={props.name}
      required={props.required}
      variant="outlined"
      fullWidth={!props.notFullWidth}
      {...(props.error && { error: true, helperText: props.error })}
    />
  );
};

export default Input;
