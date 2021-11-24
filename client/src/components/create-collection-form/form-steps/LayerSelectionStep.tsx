import { DragEndEvent } from "@dnd-kit/core";
import AddIcon from "@mui/icons-material/Add";
import { Collapse } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Input from "components/common/Input";
import PageHeader from "components/common/PageHeader";
import { useState } from "react";
import { wrongStepGenerative } from "utils/pages";
import OrderableList from "../OrderableList";

const LAYER_UPLOAD_STEP_NUMBER = 2;
const INITIAL_TEXT = "";
const MINIMUM_LAYERS_REQUIRED = 1;

interface PropsT {
  stepNumber: number;
  generative: boolean;
  state: FormStateI;
  handleLayerAddition: (newLayerName: string) => void;
  handleLayerReorder: (event: DragEndEvent) => void;
  handleLayerRemoval: (layerId: string) => void;
}

/**
 * The step in which the user uploads different layers for the
 *
 * @param generative - true if the user wants to upload generative art, false
 *  otherwise (must equal true for this step to render)
 * @param stepNumber - current step the form is on (must equal
 * LAYER_UPLOAD_STEP_NUMBER for this step to render)
 * @param state - state of the form
 * @param handleLayerReorder - handles reordering of layers and their precedence
 * @param handleLayerAddition - handles addition of new layers to the collection
 * @param handleLayerRemoval - handles removal of layers from the collection
 */
const LayerSelectionStep = ({
  generative,
  stepNumber,
  state,
  handleLayerReorder,
  handleLayerAddition,
  handleLayerRemoval,
}: PropsT): JSX.Element => {
  const [text, setText] = useState(INITIAL_TEXT);

  if (wrongStepGenerative(generative, stepNumber, LAYER_UPLOAD_STEP_NUMBER)) {
    return <></>;
  }

  const handleListAdd = () => {
    if (text !== "") {
      handleLayerAddition(text);
      setText("");
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleListAdd();
    }
  };

  return (
    <>
      <PageHeader text="Add Layers for your Collection" />
      <Collapse in={state.generative.numberOfLayers > 0}>
        <OrderableList
          state={state}
          handleLayerReorder={handleLayerReorder}
          handleLayerRemoval={handleLayerRemoval}
        />
      </Collapse>
      <Box
        display="flex"
        flexDirection="column"
        alignItems={"center"}
        gap={"5px"}>
        <Input
          onKeyPress={handleInputKeyPress}
          value={text}
          multiline={false}
          placeholder="Add a layer for your NFT"
          label="Type Layer Name Here"
          required={state.generative.numberOfLayers < MINIMUM_LAYERS_REQUIRED}
          onChange={(e) => setText(e.target.value)}
        />
        <IconButton
          color="primary"
          aria-label="Add to list"
          onClick={handleListAdd}>
          <AddIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default LayerSelectionStep;
