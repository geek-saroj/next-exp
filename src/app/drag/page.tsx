"use client";
import React, { forwardRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'row';

type Row = {
  id: number;
  name: string;
};

type DraggableRowProps = {
  index: number;
  row: Row;
  moveRow: (fromIndex: number, toIndex: number) => void;
};

const DraggableRow = forwardRef<HTMLTableRowElement, DraggableRowProps>(
  ({ index, row, moveRow }: DraggableRowProps, ref) => {
    const [, drag] = useDrag({
      type: ItemType,
      item: { index },
    });

    const [, drop] = useDrop({
      accept: ItemType,
      hover: (item: { index: number }) => {
        if (item.index !== index) {
          moveRow(item.index, index);
          item.index = index; // Update the dragged item index
        }
      },
    });

    // Combine drag and drop refs
    const dragDropRef = (node: HTMLTableRowElement | null) => {
      drag(node);
      drop(node);
      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          ref.current = node;
        }
      }
    };

    return (
      <tr ref={dragDropRef} className="cursor-move hover:bg-gray-100">
        <td className="px-4 py-2 border-b">{row.id}</td>
        <td className="px-4 py-2 border-b">{row.name}</td>
      </tr>
    );
  }
);

DraggableRow.displayName = 'DraggableRow'; // Optional, but helpful for debugging

export default DraggableRow;
