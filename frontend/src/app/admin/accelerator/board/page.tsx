"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Building2, User, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data for initial state
const initialColumns = [
  { id: "REQUESTED", title: "New Applications" },
  { id: "AI_PROFILED", title: "AI Profiling Done" },
  { id: "UNDER_REVIEW", title: "Under Review" },
  { id: "ONBOARDED", title: "Fully Onboarded" },
];

// Sortable Item Component
function SortableItem({ id, item }: { id: string, item: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const router = useRouter();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-card border border-border p-4 rounded-xl mb-3 group relative hover:border-white/30 transition-colors">
      <div {...attributes} {...listeners} className="absolute top-4 right-3 text-foreground/20 hover:text-foreground/80 cursor-grab active:cursor-grabbing">
        <GripVertical size={16} />
      </div>
      <div 
        className="cursor-pointer" 
        onClick={() => router.push(`/admin/accelerator/startups/${id}`)}
      >
        <h4 className="font-bold text-foreground mb-1 pr-12 flex items-center gap-2 hover:text-saffron transition-colors">
          {item.title} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-foreground/50 mb-2">
          <Building2 size={12} /> {item.industry}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-foreground/40 uppercase tracking-widest font-heading">
          <User size={12} /> {item.founder}
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoardPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/startups", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Map backend Startup objects to the format expected by SortableItem
          const mappedItems = data.startups.map((s: any) => ({
            id: s.id,
            columnId: s.status,
            title: s.name,
            industry: s.industry || s.aiProfileData?.industry || 'Unknown',
            founder: s.founder?.email || 'Unknown'
          }));
          setItems(mappedItems);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = items.some(item => item.id === activeId);
    const isOverTask = items.some(item => item.id === overId);

    if (!isActiveTask) return;

    setItems((prev) => {
      const activeIndex = prev.findIndex(t => t.id === activeId);
      const activeItem = prev[activeIndex];

      // Dropping task over another task
      if (isOverTask) {
        const overIndex = prev.findIndex(t => t.id === overId);
        const overItem = prev[overIndex];
        
        if (activeItem.columnId !== overItem.columnId) {
          return [
            ...prev.slice(0, activeIndex),
            ...prev.slice(activeIndex + 1),
            { ...activeItem, columnId: overItem.columnId }
          ];
        }
        return arrayMove(prev, activeIndex, overIndex);
      }

      // Dropping task over an empty column area
      const isOverColumn = initialColumns.some(col => col.id === overId);
      if (isOverColumn) {
        return [
          ...prev.slice(0, activeIndex),
          ...prev.slice(activeIndex + 1),
          { ...activeItem, columnId: overId }
        ];
      }

      return prev;
    });
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
  };

  const activeItem = activeId ? items.find(item => item.id === activeId) : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 h-full flex flex-col pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground">Pipeline Board</h2>
          <p className="text-foreground/50 text-sm">Drag and drop startups across stages to manage the onboarding pipeline.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-6 h-full min-w-max items-start">
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCorners} 
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {initialColumns.map((col) => {
              const columnItems = items.filter(item => item.columnId === col.id);
              
              return (
                <div key={col.id} className="w-80 flex flex-col bg-card border border-border rounded-2xl h-[calc(100vh-200px)]">
                  {/* Column Header */}
                  <div className="p-4 border-b border-border flex items-center justify-between bg-white/5 rounded-t-2xl">
                    <span className="font-heading font-bold text-xs tracking-widest uppercase text-foreground/60">{col.title}</span>
                    <span className="bg-white/10 text-foreground/50 text-[10px] font-bold px-2 py-0.5 rounded-full">{columnItems.length}</span>
                  </div>
                  
                  {/* Column Body - Droppable Area */}
                  <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                    <SortableContext id={col.id} items={columnItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                      {columnItems.map((item) => (
                        <SortableItem key={item.id} id={item.id} item={item} />
                      ))}
                      {columnItems.length === 0 && (
                        <div className="h-full w-full flex items-center justify-center text-foreground/20 text-xs border-2 border-dashed border-border rounded-xl uppercase tracking-widest font-heading">
                          Drop Here
                        </div>
                      )}
                    </SortableContext>
                  </div>
                </div>
              );
            })}

            {/* Drag Overlay for smooth animations */}
            <DragOverlay>
              {activeItem ? (
                <div className="bg-[#1a1a1a] border border-saffron shadow-2xl p-4 rounded-xl opacity-90 rotate-2 scale-105 cursor-grabbing">
                  <h4 className="font-bold text-white mb-1">{activeItem.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                    <Building2 size={12} /> {activeItem.industry}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/40 uppercase tracking-widest font-heading">
                    <User size={12} /> {activeItem.founder}
                  </div>
                </div>
              ) : null}
            </DragOverlay>

          </DndContext>
        </div>
      </div>
    </motion.div>
  );
}
