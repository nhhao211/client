"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { Feature } from "@/hooks/useDocumentsManager";
import { CreateFeatureModal } from "@/components/documents/CreateFeatureModal";
import { MoveToFeatureModal } from "@/components/documents/MoveToFeatureModal";
import { Document } from "@/services/docService";

interface DocumentsDialogsProps {
  // Feature Create/Edit
  showCreateFeature: boolean;
  setShowCreateFeature: (val: boolean) => void;
  handleCreateFeature: (data: { title: string; description: string }) => Promise<void>;
  editingFeature: Feature | null;
  setEditingFeature: (f: Feature | null) => void;

  // Move
  showMoveModal: boolean;
  setShowMoveModal: (val: boolean) => void;
  setMoveDocId: (val: number | null) => void;
  handleMoveSubmit: (featureId: number | null) => Promise<void>;
  features: Feature[];
  moveDocTitle?: string;

  // Delete Single
  deleteId: number | null;
  setDeleteId: (id: number | null) => void;
  handleConfirmDelete: () => void;
  isDeleting: boolean;

  // Delete Bulk
  showBulkDeleteConfirm: boolean;
  setShowBulkDeleteConfirm: (val: boolean) => void;
  selectedIdsCount: number;
  handleBulkDelete: () => void;
}

export function DocumentsDialogs({
  showCreateFeature,
  setShowCreateFeature,
  handleCreateFeature,
  editingFeature,
  setEditingFeature,

  showMoveModal,
  setShowMoveModal,
  setMoveDocId,
  handleMoveSubmit,
  features,
  moveDocTitle,

  deleteId,
  setDeleteId,
  handleConfirmDelete,
  isDeleting,

  showBulkDeleteConfirm,
  setShowBulkDeleteConfirm,
  selectedIdsCount,
  handleBulkDelete
}: DocumentsDialogsProps) {
  return (
    <>
      <CreateFeatureModal 
        open={showCreateFeature} 
        onOpenChange={(open) => { setShowCreateFeature(open); if(!open) setEditingFeature(null); }}
        onSubmit={handleCreateFeature}
        initialData={editingFeature}
      />

      <MoveToFeatureModal
        open={showMoveModal}
        onOpenChange={(open) => { setShowMoveModal(open); if(!open) setMoveDocId(null); }}
        onSubmit={handleMoveSubmit}
        features={features}
        docTitle={moveDocTitle}
      />

      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showBulkDeleteConfirm} onOpenChange={(open) => !open && setShowBulkDeleteConfirm(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedIdsCount} documents?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete these {selectedIdsCount} documents? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDeleteConfirm(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
