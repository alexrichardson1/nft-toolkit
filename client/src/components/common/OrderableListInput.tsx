import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Input from "components/common/Input";

interface PropsT {
  onKeyPress: any;
  text: string;
  placeholder: string;
  label: string;
  required: boolean;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const OrderableListInput = ({
  onKeyPress,
  text,
  placeholder,
  label,
  required,
  onChange,
  onClick,
}: PropsT) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={"center"}
      gap={"5px"}>
      <Input
        onKeyPress={onKeyPress}
        value={text}
        multiline={false}
        placeholder={placeholder}
        label={label}
        required={required}
        onChange={onChange}
      />
      <IconButton color="primary" aria-label="Add to list" onClick={onClick}>
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default OrderableListInput;
