import React from "react";
import type { Campaign } from "../types/campaign";
import { STATUS_COLORS } from "../utils/constant";

interface CampaignRowProps {
  campaign: Campaign;
  onViewDetails: (campaign: Campaign) => void;
}

export const CampaignRow: React.FC<CampaignRowProps> = ({
  campaign,
  onViewDetails,
}) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">
          {campaign.name}
        </span>
        <span className="text-xs text-gray-500">{campaign.id}</span>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          STATUS_COLORS[campaign.status]
        }`}
      >
        {campaign.status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {campaign.platforms.join(", ")}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      ${campaign.budget.toLocaleString()}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      ${campaign.daily_budget.toLocaleString()}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <button
        onClick={() => onViewDetails(campaign)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        View Details
      </button>
    </td>
  </tr>
);
