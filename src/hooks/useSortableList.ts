import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type TableName = 'sections' | 'items' | 'promotions';

interface SortableItem {
  id: string;
  sort_order: number;
}

export function useReorderMutation(
  tableName: TableName,
  invalidateKeys: string[][]
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: SortableItem[]) => {
      // Update sort_order for each item
      const updates = items.map((item, index) => 
        supabase
          .from(tableName)
          .update({ sort_order: index })
          .eq('id', item.id)
      );

      const results = await Promise.all(updates);
      const error = results.find(r => r.error)?.error;
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: () => {
      toast.error('Error al reordenar');
    },
  });
}

export function useDragState<T extends SortableItem>(initialItems: T[] = []) {
  const [items, setItems] = useState<T[]>(initialItems);

  const moveItem = (activeId: string, overId: string) => {
    if (activeId === overId) return items;

    const oldIndex = items.findIndex(item => item.id === activeId);
    const newIndex = items.findIndex(item => item.id === overId);

    if (oldIndex === -1 || newIndex === -1) return items;

    const newItems = [...items];
    const [removed] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, removed);

    setItems(newItems);
    return newItems;
  };

  return { items, setItems, moveItem };
}
