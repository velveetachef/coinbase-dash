import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CryptoData } from "~/lib/apis/coinbase/types";
import { CryptoCard } from "./CryptoCard";
import styles from "./CryptoList.module.css";

interface CryptoListProps {
  cryptos: CryptoData[];
}

export function CryptoList({ cryptos }: CryptoListProps) {
  const [items, setItems] = useState<CryptoData[]>(cryptos);

  // Sync items when cryptos prop changes
  useEffect(() => {
    setItems(cryptos);
  }, [cryptos]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.symbol === active.id);
        const newIndex = items.findIndex((item) => item.symbol === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.symbol)}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.list}>
          {items.map((crypto) => (
            <SortableCryptoCard key={crypto.symbol} crypto={crypto} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

interface SortableCryptoCardProps {
  crypto: CryptoData;
}

function SortableCryptoCard({ crypto }: SortableCryptoCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: crypto.symbol });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.sortableItem} ${isDragging ? styles.dragging : ""}`}
    >
      <div {...attributes} {...listeners} className={styles.dragHandle}>
        <CryptoCard crypto={crypto} />
      </div>
    </div>
  );
}
