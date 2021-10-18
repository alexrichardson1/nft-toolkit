import { TextField } from "@mui/material";

interface PropsT {
  name?: string;
  label: React.ReactNode;
  value: unknown;
  placeholder: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  error?: string;
  type?: React.HTMLInputTypeAttribute;
}

const Input = (props: PropsT): JSX.Element => {
  return (
    <TextField
      type={props.type}
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
