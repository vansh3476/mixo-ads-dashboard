import React, { useState, useEffect, useRef } from "react";
import { Eye, MousePointer, Target } from "lucide-react";
import type { Campaign, CampaignInsights } from "../types/campaign";
import { campaignApi } from "../services/api";
import { MetricCard } from "./MetricCard";

interface CampaignDetailsModalProps {
  campaign: Campaign;
  onClose: () => void;
}

export const CampaignDetailsModal: React.FC<CampaignDetailsModalProps> = ({
  campaign,
  onClose,
}) => {
  const [insights, setInsights] = useState<CampaignInsights | null>(null);
  const [isStreaming, setIsStreaming] = useState(true);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    startStreaming();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [campaign.id]);

  const startStreaming = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setIsStreaming(true);
    const eventSource = campaignApi.streamCampaignInsights(campaign.id);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setInsights(data);
      } catch (error) {}
    };

    eventSource.onerror = (error) => {
      eventSource.close();
      setIsStreaming(false);

      setTimeout(() => {
        if (eventSourceRef.current === eventSource) {
          startStreaming();
        }
      }, 5000);
    };

    eventSource.onopen = () => {
      setIsStreaming(true);
    };

    eventSourceRef.current = eventSource;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{campaign.name}</h2>
            <p className="text-sm text-gray-500">{campaign.id}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {insights ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <MetricCard
                  title="Impressions"
                  value={insights.impressions?.toLocaleString() || "N/A"}
                  icon={Eye}
                  subtitle={`Last updated: ${new Date(
                    insights.timestamp
                  ).toLocaleTimeString()}`}
                />
                <MetricCard
                  title="Clicks"
                  value={insights.clicks?.toLocaleString() || "N/A"}
                  icon={MousePointer}
                  subtitle={`CTR: ${insights.ctr?.toFixed(2)}%`}
                />
                <MetricCard
                  title="Conversions"
                  value={insights.conversions?.toLocaleString() || "N/A"}
                  icon={Target}
                  subtitle={`Rate: ${insights.conversion_rate?.toFixed(2)}%`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Performance Metrics
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Click-through Rate
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {insights.ctr?.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Cost per Click
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ${insights.cpc?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Conversion Rate
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {insights.conversion_rate?.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Budget Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Spend</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${insights.spend?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Campaign Budget
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ${campaign.budget?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Daily Budget
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ${campaign.daily_budget?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Connecting to live stream...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
