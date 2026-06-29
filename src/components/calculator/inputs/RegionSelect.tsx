"use client";

import { motion } from "framer-motion";
import { fadeInUp, transitions } from "@/lib/animations";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Region } from "@/lib/tax/config";

interface RegionSelectProps {
  value: Region;
  onChange: (value: Region) => void;
}

const REGIONS: { value: Region; label: string; description: string }[] = [
  {
    value: "uk",
    label: "England, Wales & Northern Ireland",
    description: "Standard UK income tax rates",
  },
  {
    value: "scotland",
    label: "Scotland",
    description: "Scottish income tax rates apply",
  },
];

export function RegionSelect({ value, onChange }: RegionSelectProps) {
  return (
    <motion.div
      className="flex gap-2 lg:gap-4"
      variants={fadeInUp}
      transition={transitions.snappy}
    >
      <Label htmlFor="region">Region</Label>

      <Select value={value} onValueChange={(v) => onChange(v as Region)}>
        <SelectTrigger id="region" className="flex-1 text-start h-12!">
          <SelectValue placeholder="Select region" />
        </SelectTrigger>
        <SelectContent>
          {REGIONS.map((region) => (
            <SelectItem key={region.value} value={region.value}>
              <div className="flex-1 flex flex-col py-0.5">
                <span className="text-sm font-medium">{region.label}</span>
                <span className="text-xs text-muted-foreground">
                  {region.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
}
