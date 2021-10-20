import Input from "./Input";
import Tabs from "./Tabs";
import formReducer from "./formReducer";
import NetworkContext from "context/network/NetworkContext";
import ImageUpload from "./custom-image-upload/ImageUpload";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { FormEvent, useContext, useReducer } from "react";
import Box from "@mui/material/Box";
import SvgLogo from "components/common/SvgLogo";

const ICON_SIZE = 25;

const initialState = {
  collectionName: "",
  description: "",
  images: [],
  mintingPrice: 0,
};

const Form = (): JSX.Element => {
  const { selectedNet } = useContext(NetworkContext);
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <Container
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        console.log(state);
      }}
      component={"form"}>
      <Grid justifyContent="center" spacing={2} direction="column" container>
        <Grid item md={12}>
          <Paper>
            <Input
              label="Collection Name"
              value={state.collectionName}
              placeholder="Please enter your collection name"
              onChange={(e) =>
                dispatch({ type: "CHANGE_NAME", payload: e.target.value })
              }
              required
            />
          </Paper>
        </Grid>
        <Grid item md={12}>
          <Paper>
            <Input
              rows={4}
              label="Description"
              value={state.description}
              placeholder="Please enter a description"
              multiline
              required
              onChange={(e) =>
                dispatch({
                  type: "CHANGE_DESCRIPTION",
                  payload: e.target.value,
                })
              }
            />
          </Paper>
        </Grid>
        <Grid item md={12}>
          <Paper>
            <ImageUpload files={state.images} dispatch={dispatch} />
          </Paper>
        </Grid>
        {state.images.length > 0 && (
          <Grid item md={12}>
            <Paper>
              <Tabs files={state.images} />
            </Paper>
          </Grid>
        )}
        <Grid item md={12}>
          <Paper>
            <Input
              label="Minting Price"
              required
              type="number"
              onChange={(e) =>
                dispatch({ type: "CHANGE_PRICE", payload: e.target.value })
              }
              value={state.mintingPrice}
              placeholder="Enter minting price"
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: (
                  <InputAdornment position="end">
                    {
                      <SvgLogo
                        icon={selectedNet.icon}
                        width={ICON_SIZE}
                        height={ICON_SIZE}
                      />
                    }
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        </Grid>
        <Grid item md={12}>
          <Box sx={{ display: "flex" }}>
            <Box flexGrow={1} />
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Button
                startIcon={<ClearIcon />}
                color="error"
                size="large"
                variant="contained"
                type="reset">
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
      </Grid>
    </Container>
  );
};

export default Form;
