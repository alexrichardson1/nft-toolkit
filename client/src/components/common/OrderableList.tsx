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
import { ReactNode } from "react";

const listStyle = { padding: 3, gap: 2, maxWidth: 1, overflow: "hidden" };

interface PropsT {
  items: LayerI[] | TierI[];
  children: ReactNode;
  handleItemReorder: (event: DragEndEvent) => void;
}

/**
 * Orderable list to allow users to select the precedence of each item whilst
 * also allowing them to remove any unwanted items
 *
 * @param handleItemReorder - handles reordering of items in the list
 * @param items - list items
 * @returns
 */
const OrderableList = ({
  handleItemReorder,
  children,
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
      onDragEnd={handleItemReorder}>
      <SortableContext
        items={items.map((item) => item.name)}
        strategy={verticalListSortingStrategy}>
        <List sx={listStyle}>{children}</List>
      </SortableContext>
    </DndContext>
  );
};

export default OrderableList;
