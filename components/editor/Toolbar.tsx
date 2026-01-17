"use client";

import {
  Bold,
  Italic,
  Code,
  Link,
  Heading,
  List,
  Quote,
  Wand2,
  Save,
  Download,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolbarProps {
  onFormat: () => void;
  onMagicFormat: () => void;
  onSave: () => void;
  onExport: () => void;
  onCopy: () => void;
  isFormatting?: boolean;
  isSaving?: boolean;
  isModified?: boolean;
  isAutoSaveEnabled?: boolean;
  onToggleAutoSave?: () => void;
}

const formatButtons = [
  { icon: Bold, label: "Bold", syntax: "bold" },
  { icon: Italic, label: "Italic", syntax: "italic" },
  { icon: Code, label: "Code", syntax: "code" },
  { icon: Link, label: "Link", syntax: "link" },
  { icon: Heading, label: "Heading", syntax: "heading" },
  { icon: List, label: "List", syntax: "list" },
  { icon: Quote, label: "Quote", syntax: "quote" },
] as const;

export function Toolbar({
  onFormat,
  onMagicFormat,
  onSave,
  onExport,
  onCopy,
  isFormatting = false,
  isSaving = false,
  isModified = false,
  isAutoSaveEnabled = true,
  onToggleAutoSave,
}: ToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1 px-2 py-2">
      <TooltipProvider>
        {/* Format buttons */}
        {formatButtons.map((button) => (
          <Tooltip key={button.syntax}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-pointer"
                onClick={onFormat}
              >
                <button.icon className="h-4 w-4" />
                <span className="sr-only">{button.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{button.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Magic Format Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="gap-2 cursor-pointer"
              onClick={onMagicFormat}
              disabled={isFormatting}
            >
              {isFormatting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Magic Format</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>AI-powered formatting</p>
          </TooltipContent>
        </Tooltip>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={onExport}
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Export</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export document</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isModified ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={onSave}
              disabled={isSaving || !isModified}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="sr-only">Save</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isModified ? "Save changes" : "No changes to save"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

        {/* Auto-save Toggle */}
        {onToggleAutoSave && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 cursor-pointer ${
                  isAutoSaveEnabled ? "text-emerald-500" : "text-muted-foreground"
                }`}
                onClick={onToggleAutoSave}
              >
                <span className="text-xs font-bold hidden sm:inline">
                  {isAutoSaveEnabled ? "Auto-save ON" : "Auto-save OFF"}
                </span>
                <Save className={`h-4 w-4 ${isAutoSaveEnabled ? "fill-current" : ""}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isAutoSaveEnabled ? "Disable auto-save" : "Enable auto-save"}</p>
            </TooltipContent>
          </Tooltip>
        )}


        <Separator orientation="vertical" className="mx-1 h-6" />
    </div>
  );
}
