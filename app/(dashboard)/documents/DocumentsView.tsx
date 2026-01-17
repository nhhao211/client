"use client";

import { AnimatedBackground } from "@/components/ui/animated-background";
import { useDocumentsManager } from "@/hooks/useDocumentsManager";
import { Document } from "@/services/docService";
import { Feature } from "@/hooks/useDocumentsManager";

import { DocumentsHeader } from "@/components/documents/views/DocumentsHeader";
import { DocumentsToolbar } from "@/components/documents/views/DocumentsToolbar";
import { FeatureGrid } from "@/components/documents/views/FeatureGrid";
import { DocumentGrid } from "@/components/documents/views/DocumentGrid";
import { DocumentsDialogs } from "@/components/documents/views/DocumentsDialogs";

interface DocumentsViewProps {
  initialDocs: Document[];
  initialFeatures: Feature[];
}

export default function DocumentsView({ initialDocs, initialFeatures }: DocumentsViewProps) {
  const { state, setters, handlers } = useDocumentsManager({ initialDocs, initialFeatures });

  return (
    <>
      <AnimatedBackground />
      <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
        <DocumentsHeader 
          activeFeature={state.activeFeature}
          setActiveFeature={setters.setActiveFeature}
          selectedIds={state.selectedIds}
          setShowBulkDeleteConfirm={setters.setShowBulkDeleteConfirm}
          viewMode={state.viewMode}
          setShowCreateFeature={setters.setShowCreateFeature}
          handleCreateDoc={handlers.handleCreateDoc}
          creating={state.creating}
        />

        <DocumentsToolbar 
          viewMode={state.viewMode}
          setViewMode={setters.setViewMode}
          handleSelectAll={handlers.handleSelectAll}
          isAllSelected={state.isAllSelected}
          search={state.search}
          setSearch={setters.setSearch}
        />

        <div className="space-y-8">
          {state.viewMode === "folders" && !state.activeFeature && (
            <FeatureGrid 
              features={state.filteredFeatures}
              setActiveFeature={setters.setActiveFeature}
              setEditingFeature={setters.setEditingFeature}
              setShowCreateFeature={setters.setShowCreateFeature}
              handleDeleteFeature={handlers.handleDeleteFeature}
            />
          )}

          <DocumentGrid 
            docs={state.filteredDocs}
            viewMode={state.viewMode}
            activeFeature={state.activeFeature}
            featuresCount={state.filteredFeatures.length}
            search={state.search}
            handleDelete={handlers.handleDelete}
            handleToggleFavorite={handlers.handleToggleFavorite}
            selectedIds={state.selectedIds}
            handleSelect={handlers.handleSelect}
            isSelectionMode={state.isSelectionMode}
            handleMove={handlers.handleMove}
          />
        </div>

        <DocumentsDialogs 
          showCreateFeature={state.showCreateFeature}
          setShowCreateFeature={setters.setShowCreateFeature}
          handleCreateFeature={handlers.handleCreateFeature}
          editingFeature={state.editingFeature}
          setEditingFeature={setters.setEditingFeature}
          
          showMoveModal={state.showMoveModal}
          setShowMoveModal={setters.setShowMoveModal}
          setMoveDocId={setters.setMoveDocId}
          handleMoveSubmit={handlers.handleMoveSubmit}
          features={state.features}
          moveDocTitle={state.docs.find(d => d.id === state.moveDocId)?.title}
          
          deleteId={state.deleteId}
          setDeleteId={setters.setDeleteId}
          handleConfirmDelete={handlers.handleConfirmDelete}
          isDeleting={state.isDeleting}
          
          showBulkDeleteConfirm={state.showBulkDeleteConfirm}
          setShowBulkDeleteConfirm={setters.setShowBulkDeleteConfirm}
          selectedIdsCount={state.selectedIds.length}
          handleBulkDelete={handlers.handleBulkDelete}
        />
      </div>
    </>
  );
}
