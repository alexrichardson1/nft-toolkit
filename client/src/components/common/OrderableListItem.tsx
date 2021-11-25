import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Theme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { SxProps } from "@mui/system";

const listItemStyle: SxProps<Theme> = {
  bgcolor: "background.paper",
  boxShadow: (theme: Theme) => theme.shadows[5],
  mb: 1,
  textTransform: "uppercase",
};

interface PropsT {
  layerName: string;
  id: string;
  handleLayerRemoval: (layerId: string) => void;
}

/**
 * Orderable list item that you can drag around and use to determine precedence
 * betweem multiple items in a list. Also has delete buttons in order to allow
 * for removal of item from the list.
 *
 * @param layerName - the name of the layer
 * @param id - the unique identifier of the layer
 * @param handleLayerRemoval - handles removal of layers from the collection
 */
const OrderableListItem = ({
  layerName,
  id,
  handleLayerRemoval,
}: PropsT): JSX.Element => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const listItemCSSStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ListItem sx={listItemStyle} ref={setNodeRef} style={listItemCSSStyle}>
      <ListItemText primary={layerName} />
      <IconButton {...attributes} {...listeners}>
        <DragIndicatorIcon fontSize="large" color="action" />
      </IconButton>
      <IconButton onClick={() => handleLayerRemoval(id)}>
        <DeleteIcon fontSize="large" color="error" />
      </IconButton>
    </ListItem>
  );
};

export default OrderableListItem;
