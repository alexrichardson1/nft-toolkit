import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Input from "components/common/Input";
import SvgLogo from "components/common/SvgLogo";
import NetworkContext from "context/network/NetworkContext";
import { useContext } from "react";

const DESCRIPTION_ROWS = 4;
const ICON_SIZE = 25;

interface PropsT {
  state: FormStateI;
  handleCollNameChange: (e: InputEventT) => void;
  handleDescriptionChange: (e: InputEventT) => void;
  handleMintPriceChange: (e: InputEventT) => void;
}

const priceInputProps = (selectedNet: NetworkT) => ({
  inputProps: { min: "0", step: "any" },
  endAdornment: (
    <InputAdornment position="end">
      <SvgLogo icon={selectedNet.icon} width={ICON_SIZE} height={ICON_SIZE} />
    </InputAdornment>
  ),
});

const GeneralInfo = ({
  state,
  handleCollNameChange,
  handleMintPriceChange,
  handleDescriptionChange,
}: PropsT): JSX.Element => {
  const { selectedNet } = useContext(NetworkContext);
  return (
    <>
      <Paper>
        <Input
          inputProps={{ "data-testid": "collection-name-input" }}
          value={state.collectionName}
          onChange={handleCollNameChange}
          placeholder="Enter a collection name"
          label="Collection Name"
          required
        />
      </Paper>

      <Paper>
        <Input
          inputProps={{ "data-testid": "description-input" }}
          value={state.description}
          multiline
          onChange={handleDescriptionChange}
          placeholder="Enter a description"
          rows={DESCRIPTION_ROWS}
          label="Description"
          required
        />
      </Paper>

      <Paper>
        <Input
          value={state.mintingPrice}
          onChange={handleMintPriceChange}
          placeholder="Enter a minting price"
          label="Minting Price"
          type="number"
          InputProps={priceInputProps(selectedNet)}
          required
        />
      </Paper>
    </>
  );
};

export default GeneralInfo;
