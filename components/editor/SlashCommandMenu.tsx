"use client";

import React, { useEffect, useRef } from "react";
import { Command } from "cmdk";
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  CheckSquare, 
  Code, 
  Workflow, 
  GitGraph, 
  Table,
  Sparkles
} from "lucide-react";
import { useTheme } from "next-themes";

interface SlashCommandMenuProps {
  position: { top: number; left: number } | null;
  onSelect: (item: string) => void;
  onClose: () => void;
  placement?: "top" | "bottom";
  parentHeight?: number;
}

const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  position,
  onSelect,
  onClose,
  placement = "bottom",
  parentHeight = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!position) return null;

  const style: React.CSSProperties = {
    position: "absolute",
    left: position.left,
    zIndex: 50,
  };

  if (placement === "bottom") {
    style.top = position.top + 24;
  } else {
    // Nếu placement là top, ta tính bottom position dựa trên chiều cao của editor
    // parentHeight là chiều cao của container editor
    // position.top là khoảng cách từ đỉnh editor đến dòng hiện tại
    style.bottom = parentHeight - position.top + 6;
  }

  return (
    <div
      ref={ref}
      style={style}
      className="w-72 overflow-hidden rounded-lg border bg-popover shadow-md animate-in fade-in zoom-in-95 duration-100"
    >
      <Command 
        className="w-full bg-transparent"
        loop
      >
        <div className="border-b px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
          Basic Blocks
        </div>
        <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
          <Command.Empty className="py-2 text-center text-xs text-muted-foreground">
            No results found.
          </Command.Empty>

          <Item icon={<Heading1 size={16} />} label="Heading 1" onSelect={() => onSelect("h1")} />
          <Item icon={<Heading2 size={16} />} label="Heading 2" onSelect={() => onSelect("h2")} />
          <Item icon={<Heading3 size={16} />} label="Heading 3" onSelect={() => onSelect("h3")} />
          <Item icon={<List size={16} />} label="Bullet List" onSelect={() => onSelect("ul")} />
          <Item icon={<CheckSquare size={16} />} label="To-do List" onSelect={() => onSelect("todo")} />
          <Item icon={<Code size={16} />} label="Code Block" onSelect={() => onSelect("code")} />
          
          <div className="mt-2 mb-1 border-t mx-1" />
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
            Diagrams (Mermaid)
          </div>

          <Item 
            icon={<Sparkles size={16} className="text-indigo-500" />} 
            label="AI Diagram Generator" 
            desc="Describe & Generate"
            onSelect={() => onSelect("ai-diagram")} 
          />
          
          <Item 
            icon={<Workflow size={16} />} 
            label="Flowchart" 
            desc="Process flow diagram"
            onSelect={() => onSelect("mermaid-flow")} 
          />
          <Item 
            icon={<GitGraph size={16} />} 
            label="Sequence Diagram" 
            desc="Interaction diagram"
            onSelect={() => onSelect("mermaid-sequence")} 
          />
           <Item 
            icon={<Table size={16} />} 
            label="Gantt Chart" 
            desc="Project timeline"
            onSelect={() => onSelect("mermaid-gantt")} 
          />
        </Command.List>
      </Command>
    </div>
  );
};

const Item = ({ icon, label, desc, onSelect }: { icon: React.ReactNode, label: string, desc?: string, onSelect: () => void }) => {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <div className="mr-2 flex h-4 w-4 items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <div className="flex flex-col">
        <span>{label}</span>
        {desc && <span className="text-[10px] text-muted-foreground">{desc}</span>}
      </div>
    </Command.Item>
  );
};

export default SlashCommandMenu;
