"use client";

import { motion } from "framer-motion";
import { Feature } from "@/hooks/useDocumentsManager";
import { FeatureCard } from "@/components/documents/FeatureCard";
import { container, item } from "./animations";

interface FeatureGridProps {
  features: Feature[];
  setActiveFeature: (feature: Feature) => void;
  setEditingFeature: (feature: Feature) => void;
  setShowCreateFeature: (show: boolean) => void;
  handleDeleteFeature: (id: number) => void;
}

export function FeatureGrid({
  features,
  setActiveFeature,
  setEditingFeature,
  setShowCreateFeature,
  handleDeleteFeature
}: FeatureGridProps) {
  if (features.length === 0) return null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {features.map(feature => (
          <motion.div key={feature.id} variants={item}>
            <FeatureCard 
              feature={feature} 
              onClick={() => setActiveFeature(feature)}
              onEdit={(f) => { setEditingFeature(f); setShowCreateFeature(true); }}
              onDelete={handleDeleteFeature}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
