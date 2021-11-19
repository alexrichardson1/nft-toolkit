import AddIcon from "@mui/icons-material/Add";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Input from "components/common/Input";
import useArray from "hooks/useArray";
import { useState } from "react";
import {
  arrayMove,
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle,
} from "react-sortable-hoc";
import { wrongPage } from "utils/pages";

const PAGE_2 = 2;

/**
 * The interface used for each `SortableItem`
 */
interface ItemI {
  id: string;
  text: string;
}

interface IndexI {
  oldIndex: number;
  newIndex: number;
}

/**
 * Drag icon used for `SortableItem`
 */
const DragHandle = sortableHandle(() => (
  <ListItemIcon>
    <DragHandleIcon />
  </ListItemIcon>
));

/**
 * List item for each layer
 */
const SortableItem = sortableElement(({ text }: { text: string }) => (
  <ListItem ContainerComponent="div">
    <ListItemText primary={text} />
    <ListItemSecondaryAction>
      <DragHandle />
    </ListItemSecondaryAction>
  </ListItem>
));

/**
 * Sortable container for `SortableItem`
 */
const SortableListContainer = sortableContainer(
  ({ items }: { items: ItemI[] }) => (
    <List component="div">
      {items.map(({ id, text }: ItemI, index: number) => (
        <SortableItem key={id} index={index} text={text} />
      ))}
    </List>
  )
);

interface PropsT {
  pageNumber: number;
  generative: boolean;
  state: FormStateI;
}

/**
 * Sortable list for each layer of the NFT collection
 * @param props - props required for the `JSX.Element`
 * @returns the corresponding `JSX.Element`
 */
const SortableList = ({ generative, pageNumber }: PropsT): JSX.Element => {
  if (wrongPage(generative, pageNumber, PAGE_2)) {
    return <></>;
  }

  let counter = 1;
  const [text, setText] = useState("");
  const { array: items, set: setItems, push } = useArray<ItemI>([]);

  // TODO: string validation
  const addItem = (text: string) => {
    push({ id: `${counter++}`, text: text });
  };

  const onSortEnd = ({ oldIndex, newIndex }: IndexI) => {
    setItems((items) => arrayMove(items, oldIndex, newIndex));
  };

  return (
    <Box>
      <SortableListContainer
        items={items}
        onSortEnd={onSortEnd}
        useDragHandle={true}
        lockAxis="y"
      />
      <Input
        value={text}
        multiline={false}
        placeholder="Add a layer for your NFT"
        label="Type Layer Name Here"
        required={true}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <IconButton
        color="primary"
        aria-label="Add to list"
        onClick={() => {
          addItem(text);
          setText("");
        }}>
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default SortableList;
