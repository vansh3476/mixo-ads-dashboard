import React from "react";
import type { Campaign } from "../types/campaign";

interface FilterButtonsProps {
  campaigns: Campaign[];
  statusFilter: string;
  onFilterChange: (filter: string) => void;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  campaigns,
  statusFilter,
  onFilterChange,
}) => {
  const getCount = (status: string) => {
    return status === "all"
      ? campaigns.length
      : campaigns.filter((c) => c.status === status).length;
  };

  const filters = [
    { value: "all", label: "All", colorClass: "bg-blue-100 text-blue-700" },
    {
      value: "active",
      label: "Active",
      colorClass: "bg-green-100 text-green-700",
    },
    {
      value: "paused",
      label: "Paused",
      colorClass: "bg-yellow-100 text-yellow-700",
    },
  ];

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-3 py-1 text-sm rounded ${
            statusFilter === filter.value
              ? filter.colorClass
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {filter.label} ({getCount(filter.value)})
        </button>
      ))}
    </div>
  );
};
