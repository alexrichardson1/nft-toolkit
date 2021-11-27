import { DragEndEvent } from "@dnd-kit/core";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Input from "components/common/Input";
import OrderableListItem from "components/common/OrderableListItem";
import { useState } from "react";
import { wrongStepGenerative } from "utils/pages";
import OrderableList from "../../common/OrderableList";

const TIER_SELECTION_STEP_NUMBER = 2;
const MINIMUM_TIERS_REQUIRED = 1;

interface PropsT {
  state: FormStateI;
  stepNumber: number;
  generative: boolean;
  handleTierAdd: (newTierName: string) => void;
  handleTierReorder: (event: DragEndEvent) => void;
  handleTierRemoval: (tierName: string) => void;
}

const TierSelectionStep = ({
  state,
  handleTierReorder,
  handleTierRemoval,
  handleTierAdd,
  generative,
  stepNumber,
}: PropsT) => {
  const [text, setText] = useState("");

  if (wrongStepGenerative(generative, stepNumber, TIER_SELECTION_STEP_NUMBER)) {
    return <></>;
  }

  const handleListAdd = () => {
    if (text !== "") {
      handleTierAdd(text);
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
      <OrderableList
        handleItemReorder={handleTierReorder}
        items={state.generative.tiers}>
        {state.generative.tiers.map((tier) => (
          <OrderableListItem
            itemName={tier.name}
            id={tier.name}
            handleItemRemoval={handleTierRemoval}
          />
        ))}
      </OrderableList>

      {/* TODO: Extract component for this from layerselectionstep */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems={"center"}
        gap={"5px"}>
        <Input
          onKeyPress={handleInputKeyPress}
          value={text}
          multiline={false}
          placeholder="Add a tier for your NFT"
          label="Type Tier Name Here"
          required={state.generative.numberOfTiers < MINIMUM_TIERS_REQUIRED}
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

export default TierSelectionStep;
