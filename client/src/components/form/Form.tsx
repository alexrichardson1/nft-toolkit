import Input from "./Input";
import Tabs from "./Tabs";
import ImageUpload from "./custom-image-upload/ImageUpload";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import Container from "@mui/material/Container";
import { useState } from "react";

const Form = (): JSX.Element => {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <Container>
      <Input
        label="Collection Name"
        value=""
        placeholder="Please enter your collection name"
        required
      />
      <Input
        rows={4}
        label="Desciption"
        value=""
        placeholder="Please enter a description"
        multiline
        required
      />
      <ImageUpload setFiles={setFiles} />
      <Tabs files={files} />
      <Input
        label="Minting Price"
        type="number"
        value=""
        placeholder="Enter minting price"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
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

export default Form;
