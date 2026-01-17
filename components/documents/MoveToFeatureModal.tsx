"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Folder } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Removed complex select

interface Feature {
  id: number;
  title: string;
}

interface MoveToFeatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (featureId: number | null) => Promise<void>;
  features: Feature[];
  docTitle?: string;
}

export function MoveToFeatureModal({ open, onOpenChange, onSubmit, features, docTitle }: MoveToFeatureModalProps) {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>("none");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);
      const featureId = selectedFeatureId === "none" ? null : parseInt(selectedFeatureId);
      await onSubmit(featureId);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
                Move <span className="font-bold text-foreground">{docTitle || "this document"}</span> to a folder:
            </p>
            <div className="space-y-2">
                <Label>Select Folder</Label>
                <div className="relative">
                    <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <select
                        value={selectedFeatureId}
                        onChange={(e) => setSelectedFeatureId(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                    >
                        <option value="none">-- No Folder (Uncategorized) --</option>
                        {features.map(f => (
                            <option key={f.id} value={f.id.toString()}>
                                {f.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
