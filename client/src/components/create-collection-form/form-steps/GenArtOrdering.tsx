import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Theme } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { SxProps } from "@mui/system";
import Input from "components/common/Input";
import { useCallback, useState } from "react";
import { wrongPageGenerative } from "utils/pages";

const LAYER_SELECTION_PAGE = 2;
const INITIAL_TEXT = "";

const listItemStyle: SxProps<Theme> = {
  bgcolor: "background.paper",
  boxShadow: (theme: Theme) => theme.shadows[5],
  mb: 1,
  textTransform: "capitalize",
};

interface ItemPropsT {
  text: string;
  id: string;
  handleLayerRemoval: (layerId: string) => void;
}

/**
 * List item for each layer
 */
const SortableItem = ({ text, id, handleLayerRemoval }: ItemPropsT) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ListItem
      sx={listItemStyle}
      ref={setNodeRef}
      style={style}
      ContainerComponent="div">
      <ListItemText primary={text} />
      <IconButton {...attributes} {...listeners}>
        <DragIndicatorIcon fontSize="large" color="action" />
      </IconButton>
      <IconButton onClick={() => handleLayerRemoval(id)}>
        <DeleteIcon fontSize="large" color="error" />
      </IconButton>
    </ListItem>
  );
};

/**
 * Sortable container for `SortableItem`
 */
interface PropsT {
  pageNumber: number;
  generative: boolean;
  state: FormStateI;
  handleLayerAddition: (newLayerName: string) => void;
  handleLayerReorder: (event: DragEndEvent) => void;
  handleLayerRemoval: (layerId: string) => void;
}

const listStyle = { padding: 3, gap: 2, maxWidth: 1, overflow: "hidden" };
/**
 * Sortable list for each layer of the NFT collection
 * @param props - props required for the `JSX.Element`
 * @returns the corresponding `JSX.Element`
 */
const SortableList = ({
  generative,
  pageNumber,
  state,
  handleLayerReorder,
  handleLayerAddition,
  handleLayerRemoval,
}: PropsT): JSX.Element => {
  if (wrongPageGenerative(generative, pageNumber, LAYER_SELECTION_PAGE)) {
    return <></>;
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [text, setText] = useState(INITIAL_TEXT);

  return (
    <Box>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleLayerReorder}>
        <SortableContext
          items={state.generative.layers.map((layer) => layer.layerId)}
          strategy={verticalListSortingStrategy}>
          <List component="div" sx={listStyle}>
            {state.generative.layers.map((layer) => (
              <SortableItem
                id={layer.layerId}
                key={layer.layerId}
                text={layer.name}
                handleLayerRemoval={handleLayerRemoval}
              />
            ))}
          </List>
        </SortableContext>
      </DndContext>
      <Input
        value={text}
        multiline={false}
        placeholder="Add a layer for your NFT"
        label="Type Layer Name Here"
        required={state.generative.numberOfLayers <= 0}
        onChange={useCallback(
          (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
            setText(e.target.value),
          [text]
        )}
      />
      <IconButton
        color="primary"
        aria-label="Add to list"
        onClick={useCallback(() => {
          handleLayerAddition(text);
          setText("");
        }, [text])}>
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default SortableList;
