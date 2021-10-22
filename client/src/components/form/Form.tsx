import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import SvgLogo from "components/common/SvgLogo";
import NetworkContext from "context/network/NetworkContext";
import { FormEvent, useContext, useReducer } from "react";
import formReducer from "reducers/formReducer";
import ImageUpload from "./custom-image-upload/ImageUpload";
import FormGridItem from "./FormGridInput";
import Tabs from "./tabs/Tabs";

const ICON_SIZE = 25;
const INITIAL_STATE = {
  collectionName: "",
  description: "",
  images: [],
  mintingPrice: 0,
};

const buttonsWrapperStyle = { display: "flex", gap: "10px" };
const buttonContainerStyle = { display: "flex" };

const priceInputProps = (selectedNet: NetworkT) => ({
  inputProps: { min: "0.00", step: "any" },
  endAdornment: (
    <InputAdornment position="end">
      {<SvgLogo icon={selectedNet.icon} width={ICON_SIZE} height={ICON_SIZE} />}
    </InputAdornment>
  ),
});

const Form = (): JSX.Element => {
  const { selectedNet } = useContext(NetworkContext);
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);

  const handleImageDelete = (deleteId: string) => {
    dispatch({ type: "DELETE_IMAGE", payload: { deleteId } });
  };

  const handleImgNameChange = (e: InputEventT, id: string) =>
    dispatch({
      type: "CHANGE_IMAGE_NAME",
      payload: {
        newImgObj: {
          newImageName: e.target.value,
          imageId: id,
        },
      },
    });

  const handleImageDrop = (
    e: React.DragEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>,
    imgObjs: FileList | null
  ) => {
    e.preventDefault();
    dispatch({
      type: "CHANGE_IMAGES",
      payload: { images: Array.from(imgObjs || []) },
    });
  };

  const handleCollNameChange = (e: InputEventT) =>
    dispatch({
      type: "CHANGE_NAME",
      payload: { newName: e.target.value },
    });

  const handleDescriptionChange = (e: InputEventT) =>
    dispatch({
      type: "CHANGE_DESCRIPTION",
      payload: { description: e.target.value },
    });

  const handleMintPriceChange = (e: InputEventT) =>
    dispatch({
      type: "CHANGE_PRICE",
      payload: { price: e.target.value },
    });

  const handleStateReset = () =>
    dispatch({ type: "RESET_STATE", payload: { initialState: INITIAL_STATE } });

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(state);
  };

  const collectionNameGrid = (
    <FormGridItem
      value={state.collectionName}
      onChange={handleCollNameChange}
      placeholder="Enter a collection name"
      label="Collection Name"
    />
  );

  const descriptionGrid = (
    <FormGridItem
      value={state.description}
      multiline
      onChange={handleDescriptionChange}
      placeholder="Enter a description"
      rows={4}
      label="Description"
    />
  );

  const mintingGrid = (
    <FormGridItem
      value={state.mintingPrice}
      onChange={handleMintPriceChange}
      placeholder="Enter a minting price"
      label="Minting Price"
      type="number"
      InputProps={priceInputProps(selectedNet)}
    />
  );

  const resetGrid = (
    <Grid item md={12}>
      <Box sx={buttonContainerStyle}>
        <Box flexGrow={1} />
        <Box sx={buttonsWrapperStyle}>
          <Button
            startIcon={<ClearIcon />}
            color="error"
            size="large"
            variant="contained"
            type="reset"
            onClick={handleStateReset}>
            Reset
          </Button>
          <Button
            type="submit"
            endIcon={<DoneIcon />}
            color="success"
            size="large"
            variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
    </Grid>
  );

  return (
    <Container onSubmit={handleFormSubmit} component="form">
      <Grid justifyContent="center" spacing={2} direction="column" container>
        {collectionNameGrid}
        {descriptionGrid}
        <Grid item md={12}>
          <Paper>
            <ImageUpload
              handleImageDrop={handleImageDrop}
              imgObjs={state.images}
            />
          </Paper>
        </Grid>
        {state.images.length > 0 && (
          <Grid item md={12}>
            <Paper>
              <Tabs
                handleImageDelete={handleImageDelete}
                handleNameChange={handleImgNameChange}
                imgObjs={state.images}
              />
            </Paper>
          </Grid>
        )}
        {mintingGrid}
        {resetGrid}
      </Grid>
    </Container>
  );
};

export default Form;
