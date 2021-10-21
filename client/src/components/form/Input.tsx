import { OutlinedInputProps, TextField, Theme } from "@mui/material";
import { SxProps } from "@mui/system";

interface PropsT {
  name?: string;
  label: React.ReactNode;
  value: unknown;
  placeholder: string;
  required?: boolean;
  multiline?: boolean;
  InputProps?: Partial<OutlinedInputProps>;
  rows?: number;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  error?: string;
  type?: React.HTMLInputTypeAttribute;
  sx?: SxProps<Theme>;
}

const Input = (props: PropsT): JSX.Element => {
  return (
    <TextField
      sx={props.sx}
      type={props.type}
      InputProps={props.InputProps}
      variant="outlined"
      label={props.label}
      name={props.name}
      value={props.value}
      placeholder={props.placeholder}
      multiline={props.multiline}
      rows={props.rows}
      required={props.required}
      onChange={props.onChange}
      fullWidth
      {...(props.error && { error: true, helperText: props.error })}
    />
  );
};

export default Input;
