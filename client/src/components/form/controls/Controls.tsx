import Input from "./Input";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import { ButtonGroup, Container, useTheme } from "@mui/material";

const Controls = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Container
      sx={{ py: "20px", background: theme.palette.background.default }}>
      <Input
        label="Collection Name"
        value=""
        placeholder="Please enter your collection name"
        required={true}
      />
      <Input
        multiline={true}
        rows={4}
        label="Desciption"
        value=""
        placeholder="Please enter a description"
        required={true}
      />
      <ButtonGroup>
        <Button
          startIcon={<ClearIcon />}
          color="error"
          size="large"
          variant="contained">
          Cancel
        </Button>
        <Button
          endIcon={<DoneIcon />}
          color="success"
          size="large"
          variant="contained">
          Submit
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default Controls;
