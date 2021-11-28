import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, Theme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { SxProps } from "@mui/system";
import InfoTooltip from "components/common/InfoToolTip";
import Input from "components/common/Input";

const listItemStyle: SxProps<Theme> = {
  bgcolor: "background.paper",
  boxShadow: (theme: Theme) => theme.shadows[5],
  mb: 1,
  textTransform: "uppercase",
};

interface PropsT {
  itemName: string;
  id: string;
  numericInput?: {
    numberInputValue: string;
    numberInputLabel: string;
    handleNumberInputChange: (e: InputEventT) => void;
    tooltipText: string;
  };
  handleItemRemoval: (itemId: string) => void;
}

/**
 * Orderable list item that you can drag around and use to determine precedence
 * betweem multiple items in a list. Also has delete buttons in order to allow
 * for removal of item from the list.
 *
 * @param itemName - the name of the item
 * @param id - the unique identifier of the item
 * @param numericInput - object containing the following items:
 *        numberInputValue - value of numeric input
 *        numberInputLabel- label of numeric input
 *        handleItemRemoval - handles removal of items
 */
const OrderableListItem = ({
  itemName,
  id,
  numericInput,
  handleItemRemoval,
}: PropsT): JSX.Element => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const listItemCSSStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ListItem sx={listItemStyle} ref={setNodeRef} style={listItemCSSStyle}>
      <ListItemText primary={itemName} />
      <Box display="flex" alignItems="center" gap="10px">
        {typeof numericInput !== "undefined" && (
          <Input
            notFullWidth
            required
            value={numericInput.numberInputValue}
            label={numericInput.numberInputLabel}
            placeholder="0"
            type="number"
            onChange={numericInput.handleNumberInputChange}
            InputProps={{
              inputProps: { min: "0", max: "100", step: "1" },
              endAdornment: (
                <InputAdornment position="end">
                  <InfoTooltip text={numericInput.tooltipText} />
                </InputAdornment>
              ),
            }}
          />
        )}
        <IconButton {...attributes} {...listeners}>
          <DragIndicatorIcon fontSize="large" color="action" />
        </IconButton>
        <IconButton
          data-testid="delete-item-btn"
          onClick={() => handleItemRemoval(id)}>
          <DeleteIcon fontSize="large" color="error" />
        </IconButton>
      </Box>
    </ListItem>
  );
};

export default OrderableListItem;
