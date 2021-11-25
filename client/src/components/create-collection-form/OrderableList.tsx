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
  items: LayerI[];
  handleLayerReorder: (event: DragEndEvent) => void;
  handleLayerRemoval: (layerId: string) => void;
}

/**
 * Orderable list to allow users to select the precedence of each layer whilst
 *  also allowing them to remove any unwanted layers
 *
 * @param handleLayerRemoval - handles removal of item from list
 * @param handleLayerReorder - handles reordering of items in the list
 * @param items - list items
 * @returns
 */
const OrderableList = ({
  handleLayerRemoval,
  handleLayerReorder,
  items,
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
        items={items.map((layer) => layer.layerId)}
        strategy={verticalListSortingStrategy}>
        <List sx={listStyle}>
          {items.map((layer) => (
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
