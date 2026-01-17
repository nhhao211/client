"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Document } from "@/services/docService";
import {
  createDocumentAction,
  updateDocumentAction,
  deleteDocumentAction,
  bulkDeleteDocumentsAction,
  createFeatureAction,
  getFeaturesAction,
  updateFeatureAction,
  deleteFeatureAction
} from "@/app/serverActions";

export interface Feature {
  id: number;
  title: string;
  description?: string;
  status: string;
  _count?: {
    documents: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface UseDocumentsManagerProps {
  initialDocs: Document[];
  initialFeatures: Feature[];
}

export function useDocumentsManager({ initialDocs, initialFeatures }: UseDocumentsManagerProps) {
  const router = useRouter();

  // State
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [viewMode, setViewMode] = useState<"files" | "folders">("folders");
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  
  // Selection & Deletion State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  
  // Feature & Move State
  const [showCreateFeature, setShowCreateFeature] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveDocId, setMoveDocId] = useState<number | null>(null);

  // Sync Initial State
  useEffect(() => {
    setDocs(initialDocs);
  }, [initialDocs]);

  useEffect(() => {
    setFeatures(initialFeatures);
  }, [initialFeatures]);

  // Sync activeFeature on view change
  useEffect(() => {
    if (viewMode === "files") {
        setActiveFeature(null);
    }
  }, [viewMode]);

  // Actions
  async function loadFeatures() {
    try {
      const data = await getFeaturesAction();
      setFeatures(data);
    } catch (error) {
      console.error("Failed to load features", error);
    }
  }

  async function handleCreateDoc() {
    try {
      setCreating(true);
      const newDoc = await createDocumentAction({ 
        title: "Untitled Document", 
        content: "",
        ...(activeFeature ? { featureId: activeFeature.id } : {})
      });
      router.push(`/editor/${newDoc.id}`);
    } catch (error) {
      toast.error("Failed to create document");
      setCreating(false);
    }
  }

  async function handleCreateFeature(data: { title: string; description: string }) {
    try {
      if (editingFeature) {
        await updateFeatureAction(editingFeature.id, data);
        toast.success("Feature updated");
      } else {
        await createFeatureAction(data);
        toast.success("Feature created");
      }
      loadFeatures();
      setEditingFeature(null);
    } catch (error) {
       toast.error(editingFeature ? "Failed to update feature" : "Failed to create feature");
       throw error;
    }
  }

  async function handleDeleteFeature(id: number) {
    if (!confirm("Are you sure? Documents inside will be uncategorized.")) return;
    try {
      await deleteFeatureAction(id);
      loadFeatures();
      toast.success("Feature deleted");
      if (activeFeature && activeFeature.id === id) {
        setActiveFeature(null);
      }
    } catch (error) {
      toast.error("Failed to delete feature");
    }
  }

  function handleDelete(id: number) {
    setDeleteId(id);
  }

  async function handleConfirmDelete() {
    if (deleteId === null) return;
    try {
      setIsDeleting(true);
      await deleteDocumentAction(deleteId);
      setDocs(docs.filter(d => d.id !== deleteId));
      if (selectedIds.includes(deleteId)) {
          setSelectedIds(selectedIds.filter(id => id !== deleteId));
      }
      toast.success("Document deleted");
      router.refresh();
      loadFeatures();
    } catch (error) {
      toast.error("Failed to delete document");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  }

  function handleMove(id: number) {
    setMoveDocId(id);
    setShowMoveModal(true);
  }

  async function handleMoveSubmit(featureId: number | null) {
      if (!moveDocId) return;
      try {
          await updateDocumentAction(moveDocId, { featureId });
          setDocs(docs.map(d => d.id === moveDocId ? { ...d, featureId: featureId || undefined } : d));
          toast.success("Document moved");
          loadFeatures();
      } catch (error) {
          toast.error("Failed to move document");
      }
  }

  async function handleToggleFavorite(id: number) {
    const doc = docs.find(d => d.id === id);
    if (!doc) return;
    try {
      const updated = await updateDocumentAction(id, { isFavorite: !doc.isFavorite });
      setDocs(docs.map(d => d.id === id ? updated : d));
    } catch (error) {
      toast.error("Failed to update favorite status");
    }
  }

  function handleSelect(id: number) {
      if (selectedIds.includes(id)) {
          setSelectedIds(selectedIds.filter(i => i !== id));
      } else {
          setSelectedIds([...selectedIds, id]);
      }
  }

  function handleSelectAll() {
      if (selectedIds.length === filteredDocs.length && filteredDocs.length > 0) {
          setSelectedIds([]);
      } else {
          setSelectedIds(filteredDocs.map(d => d.id));
      }
  }

  async function handleBulkDelete() {
      if (selectedIds.length === 0) return;
      try {
          setIsDeleting(true);
          await bulkDeleteDocumentsAction(selectedIds);
          setDocs(docs.filter(d => !selectedIds.includes(d.id)));
          setSelectedIds([]);
          toast.success("Documents deleted");
          router.refresh();
          loadFeatures();
      } catch (error) {
          toast.error("Failed to delete selected documents");
      } finally {
          setIsDeleting(false);
          setShowBulkDeleteConfirm(false);
      }
  }

  // Filter Logic
  const filteredDocs = useMemo(() => {
    let filtered = docs;
    if (search) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.content?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (viewMode === "folders") {
        if (activeFeature) {
            filtered = filtered.filter(doc => doc.featureId === activeFeature.id);
        } else {
            filtered = filtered.filter(doc => !doc.featureId);
        }
    }
    return filtered;
  }, [docs, search, viewMode, activeFeature]);

  const filteredFeatures = useMemo(() => {
      if (search) {
          return features.filter(f => f.title.toLowerCase().includes(search.toLowerCase()));
      }
      return features;
  }, [features, search]);

  const isAllSelected = filteredDocs.length > 0 && selectedIds.length === filteredDocs.length;
  const isSelectionMode = selectedIds.length > 0;

  return {
    state: {
      docs, features, viewMode, activeFeature, search, creating,
      deleteId, isDeleting, selectedIds, showBulkDeleteConfirm,
      showCreateFeature, editingFeature, showMoveModal, moveDocId,
      filteredDocs, filteredFeatures, isAllSelected, isSelectionMode
    },
    setters: {
      setDocs, setFeatures, setViewMode, setActiveFeature, setSearch,
      setCreating, setDeleteId, setIsDeleting, setSelectedIds, setShowBulkDeleteConfirm,
      setShowCreateFeature, setEditingFeature, setShowMoveModal, setMoveDocId
    },
    handlers: {
      handleCreateDoc, handleCreateFeature, handleDeleteFeature, handleDelete,
      handleConfirmDelete, handleMove, handleMoveSubmit, handleToggleFavorite,
      handleSelect, handleSelectAll, handleBulkDelete
    }
  };
}
