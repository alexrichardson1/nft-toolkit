import { DragEndEvent } from "@dnd-kit/core";
import { Collapse } from "@mui/material";
import OrderableListInput from "components/common/OrderableListInput";
import OrderableListItem from "components/common/OrderableListItem";
import PageHeader from "components/common/PageHeader";
import { useState } from "react";
import { wrongStepGenerative } from "utils/pages";
import OrderableList from "../../common/OrderableList";

const LAYER_UPLOAD_STEP_NUMBER = 2;
const MINIMUM_LAYERS_REQUIRED = 1;
const CHANCE_INPUT_INFO =
  "Add a likelihood value ranging from 1 (Highly Unlikely) to 100 (Guaranteed) for the chance this layer is included in a generated NFT";

interface PropsT {
  stepNumber: number;
  generative: boolean;
  state: FormStateI;
  handleLayerAddition: (newLayerName: string) => void;
  handleLayerReorder: (event: DragEndEvent) => void;
  handleLayerRemoval: (layerName: string) => void;
  handleLayerProbChange: (layerName: string) => (e: InputEventT) => void;
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
  handleLayerProbChange,
}: PropsT): JSX.Element => {
  const [text, setText] = useState("");

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
      <PageHeader text="Add Layers For Your Collection" />
      <Collapse in={state.generative.numberOfLayers > 0}>
        <OrderableList
          items={state.generative.layers}
          handleItemReorder={handleLayerReorder}>
          {state.generative.layers.map((layer) => (
            <OrderableListItem
              id={layer.name}
              key={layer.name}
              itemName={layer.name}
              handleItemRemoval={handleLayerRemoval}
              numericInput={{
                tooltipText: CHANCE_INPUT_INFO,
                numberInputLabel: "Chance (%)",
                numberInputValue: layer.probability,
                handleNumberInputChange: handleLayerProbChange(layer.name),
              }}
            />
          ))}
        </OrderableList>
      </Collapse>

      <OrderableListInput
        onKeyPress={handleInputKeyPress}
        text={text}
        placeholder="Add a layer for your NFT"
        label="Type Layer Name Here"
        required={state.generative.numberOfLayers < MINIMUM_LAYERS_REQUIRED}
        onChange={(e) => setText(e.target.value)}
        onClick={handleListAdd}
      />
    </>
  );
};

export default LayerSelectionStep;
