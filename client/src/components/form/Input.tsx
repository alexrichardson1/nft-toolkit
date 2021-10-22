import { TextField } from "@mui/material";

const Input = (props: InputPropsT): JSX.Element => {
  return (
    <TextField
      type={props.type}
      label={props.label}
      InputProps={props.InputProps}
      value={props.value}
      placeholder={props.placeholder}
      sx={props.sx}
      multiline={props.multiline}
      rows={props.rows}
      onChange={props.onChange}
      name={props.name}
      required
      variant="outlined"
      fullWidth
      {...(props.error && { error: true, helperText: props.error })}
    />
  );
};

export default Input;
