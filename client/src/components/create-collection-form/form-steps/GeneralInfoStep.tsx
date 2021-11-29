import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Input from "components/common/Input";
import PageHeader from "components/common/PageHeader";
import SvgLogo from "components/common/SvgLogo";
import NetworkContext from "context/network/NetworkContext";
import { useContext, useMemo } from "react";
import { wrongStep } from "utils/pages";

const DESCRIPTION_ROWS = 4;
const ICON_SIZE = 25;
const GENERAL_INFO_STEP_NUMBER = 0;

interface PropsT {
  stepNumber: number;
  state: FormStateI;
  handleCollNameChange: (e: InputEventT) => void;
  handleDescriptionChange: (e: InputEventT) => void;
  handleMintPriceChange: (e: InputEventT) => void;
  handleSymbolChange: (e: InputEventT) => void;
}

/**
 *
 * @param selectedNet - The network currently selected by the user
 * @returns props for the `mintinPrice` input field
 */
const priceInputProps = (selectedNet: NetworkT) => ({
  inputProps: { min: 0, step: "any" },
  endAdornment: (
    <InputAdornment position="end">
      <SvgLogo icon={selectedNet.icon} width={ICON_SIZE} height={ICON_SIZE} />
    </InputAdornment>
  ),
});

/**
 *
 *
 *
 * @param stepNumber - current step the form is on (must equal
 * GENERAL_INFO_STEP_NUMBER for this step to render)
 * @param state - state of the form
 * @param handleCollNameChange - handle change in the name of the collection
 * @param handleMintPriceChange - handle change in the minting price of the
 *  collection
 * @param handleDescriptionChange - handle change in the description of the
 * collection
 * @param handleSymbolChange - handle change in the symbol of the collection
 */
const GeneralInfoStep = ({
  stepNumber,
  state,
  handleCollNameChange,
  handleMintPriceChange,
  handleDescriptionChange,
  handleSymbolChange,
}: PropsT): JSX.Element => {
  const { selectedNet } = useContext(NetworkContext);
  const priceInputPropsMemo = useMemo(
    () => priceInputProps(selectedNet),
    [selectedNet]
  );

  if (wrongStep(stepNumber, GENERAL_INFO_STEP_NUMBER)) {
    return <></>;
  }

  return (
    <>
      <PageHeader text="Enter Collection Details Here" />
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
          inputProps={{ "data-testid": "symbol-input" }}
          value={state.symbol}
          onChange={handleSymbolChange}
          placeholder="Enter a symbol"
          label="Symbol"
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
          placeholder="0"
          label="Minting Price"
          type="number"
          InputProps={priceInputPropsMemo}
          required
        />
      </Paper>
    </>
  );
};

export default GeneralInfoStep;
