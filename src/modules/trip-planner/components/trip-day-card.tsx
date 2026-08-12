"use client";

import { ArrowDown, ArrowUp, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAddTripItemMutation,
  useDeleteTripDayMutation,
  useDeleteTripItemMutation,
  useReorderTripItemsMutation,
} from "@/features/trip/api/trip.api";
import type { TripDay } from "@/features/trip/types/trip.types";

export function TripDayCard({ tripId, day }: { tripId: string; day: TripDay }) {
  const [showAddItem, setShowAddItem] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const [addItem, { isLoading: isAdding }] = useAddTripItemMutation();
  const [deleteItem] = useDeleteTripItemMutation();
  const [deleteDay] = useDeleteTripDayMutation();
  const [reorderItems] = useReorderTripItemsMutation();

  const items = [...day.items].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleAddItem = async () => {
    if (!title.trim()) return;
    await addItem({
      tripId,
      dayId: day.id,
      data: { title: title.trim(), note: note.trim() || undefined },
    }).unwrap();
    setTitle("");
    setNote("");
    setShowAddItem(false);
  };

  const move = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    await reorderItems({
      tripId,
      dayId: day.id,
      itemIds: reordered.map((item) => item.id),
    }).unwrap();
  };

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Ngày {day.dayNumber}</p>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-destructive hover:text-destructive"
          onClick={() => deleteDay({ tripId, dayId: day.id })}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Chưa có địa điểm nào.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] bg-secondary p-3"
            >
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.note && (
                    <p className="text-xs text-muted-foreground">{item.note}</p>
                  )}
                  {item.destination && (
                    <p className="text-xs text-primary">{item.destination.name}</p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full"
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full text-destructive hover:text-destructive"
                  onClick={() => deleteItem({ tripId, dayId: day.id, itemId: item.id })}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showAddItem ? (
        <div className="mt-3 space-y-2 rounded-[var(--radius-md)] border border-dashed border-border p-3">
          <Input
            placeholder="Tên địa điểm / hoạt động"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Ghi chú (không bắt buộc)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              className="rounded-full"
              disabled={isAdding || !title.trim()}
              onClick={handleAddItem}
            >
              {isAdding ? "Đang thêm..." : "Thêm"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => setShowAddItem(false)}
            >
              Huỷ
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="mt-3 rounded-full"
          onClick={() => setShowAddItem(true)}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Thêm địa điểm
        </Button>
      )}
    </div>
  );
}
