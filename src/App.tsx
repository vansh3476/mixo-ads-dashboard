import { useState, useEffect } from "react";
import { Eye, MousePointer, Target, DollarSign } from "lucide-react";
import type { Campaign, AggregateInsights } from "./types/campaign";
import { campaignApi } from "./services/api";
import { MetricCard } from "./components/MetricCard";
import { CampaignRow } from "./components/CampaignRow";
import { CampaignDetailsModal } from "./components/CampaignDetailsModal";
import { FilterButtons } from "./components/FilterButtons";

export default function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [aggregateInsights, setAggregateInsights] =
    useState<AggregateInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [campaignsData, insightsData] = await Promise.all([
        campaignApi.getCampaigns(),
        campaignApi.getAggregateInsights(),
      ]);

      setCampaigns(campaignsData.campaigns || []);
      setAggregateInsights(insightsData.insights);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTimeout(() => {
        fetchData();
      }, 5000);
    }
  };

  const filteredCampaigns =
    statusFilter === "all"
      ? campaigns
      : campaigns.filter((c) => c.status === statusFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mixo Ads Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Campaign monitoring and analytics
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {aggregateInsights && (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard
                title="Total Impressions"
                value={aggregateInsights.total_impressions?.toLocaleString()}
                icon={Eye}
                subtitle={`${aggregateInsights.active_campaigns} active campaigns`}
              />
              <MetricCard
                title="Total Clicks"
                value={aggregateInsights.total_clicks?.toLocaleString()}
                icon={MousePointer}
                subtitle={`Avg CTR: ${aggregateInsights.avg_ctr?.toFixed(2)}%`}
              />
              <MetricCard
                title="Total Conversions"
                value={aggregateInsights.total_conversions?.toLocaleString()}
                icon={Target}
                subtitle={`Avg Rate: ${aggregateInsights.avg_conversion_rate?.toFixed(
                  2
                )}%`}
              />
              <MetricCard
                title="Total Spend"
                value={`$${aggregateInsights.total_spend?.toLocaleString()}`}
                icon={DollarSign}
                subtitle={`Avg CPC: $${aggregateInsights.avg_cpc?.toFixed(2)}`}
              />
            </div>
          </>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Campaigns</h2>
            <FilterButtons
              campaigns={campaigns}
              statusFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platforms
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Daily Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => (
                  <CampaignRow
                    key={campaign.id}
                    campaign={campaign}
                    onViewDetails={setSelectedCampaign}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedCampaign && (
        <CampaignDetailsModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  );
}
