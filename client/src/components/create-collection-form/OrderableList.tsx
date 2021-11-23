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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import List from "@mui/material/List";
import OrderableListItem from "components/common/OrderableListItem";

const listStyle = { padding: 3, gap: 2, maxWidth: 1, overflow: "hidden" };

interface PropsT {
  state: FormStateI;
  handleLayerReorder: (event: DragEndEvent) => void;
  handleLayerRemoval: (layerId: string) => void;
}

/**
 * Orderable list to allow users to select the precedence of each layer whilst
 *  also allowing them to remove any unwanted layers
 *
 * @param handleLayerRemoval - handles removal of item from list
 * @param handleLayerReorder - handles reordering of items in the list
 * @param items - state of the form
 * @returns
 */
const OrderableList = ({
  handleLayerRemoval,
  handleLayerReorder,
  state,
}: PropsT): JSX.Element => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleLayerReorder}>
      <SortableContext
        items={state.generative.layers.map((layer) => layer.layerId)}
        strategy={verticalListSortingStrategy}>
        <List sx={listStyle}>
          {state.generative.layers.map((layer) => (
            <OrderableListItem
              id={layer.layerId}
              key={layer.layerId}
              layerName={layer.name}
              handleLayerRemoval={handleLayerRemoval}
            />
          ))}
        </List>
      </SortableContext>
    </DndContext>
  );
};

export default OrderableList;
