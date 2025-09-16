import React from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency, formatDate } from "../../utils/format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faExclamationTriangle,
  faBuilding,
  faDollarSign,
  faCalendar,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import EmptyState from "../ui/EmptyState";

const Opportunities: React.FC = () => {
  const { opportunities, loading, error } = useApp();

  const getStageColor = (stage: string): string => {
    const stageColors: Record<string, string> = {
      prospecting: "text-blue-400 bg-blue-500/20",
      qualification: "text-yellow-400 bg-yellow-500/20",
      proposal: "text-purple-400 bg-purple-500/20",
      negotiation: "text-orange-400 bg-orange-500/20",
      "closed-won": "text-green-400 bg-green-500/20",
      "closed-lost": "text-red-400 bg-red-500/20",
    };
    return stageColors[stage] || "text-gray-400 bg-gray-500/20";
  };

  const formatStage = (stage: string): string => {
    return stage
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (error) {
    return (
      <div className="bg-gray-700 border border-gray-600 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start space-x-4">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5"
          />
          <div>
            <h3 className="text-lg font-medium text-red-400 mb-2">
              Error loading opportunities
            </h3>
            <p className="text-gray-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2 flex items-center">
            <FontAwesomeIcon
              icon={faChartLine}
              className="mr-3 text-gray-100"
            />
            Opportunities
          </h1>
          <p className="text-gray-300">
            {opportunities.length} opportunit
            {opportunities.length !== 1 ? "ies" : "y"} found
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && opportunities.length === 0 && (
        <EmptyState
          title="No opportunities yet"
          description="Convert leads to opportunities to see them here. Click on a lead and use the 'Convert to Opportunity' button."
          icon={() => (
            <FontAwesomeIcon icon={faChartLine} className="h-full w-full" />
          )}
        />
      )}

      {/* Opportunities Table */}
      {!loading && opportunities.length > 0 && (
        <div className="bg-gray-700 border border-gray-600 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-600/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" />
                      <span>Name</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" />
                      <span>Account</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faChartLine} className="h-4 w-4" />
                      <span>Stage</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon
                        icon={faDollarSign}
                        className="h-4 w-4"
                      />
                      <span>Amount</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faCalendar} className="h-4 w-4" />
                      <span>Created</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faIdCard} className="h-4 w-4" />
                      <span>Lead ID</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-700 divide-y divide-gray-600">
                {opportunities.map((opportunity) => (
                  <tr
                    key={opportunity.id}
                    className="border-b border-gray-600 hover:bg-gray-600/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-100">
                        {opportunity.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-100">
                        {opportunity.accountName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStageColor(
                          opportunity.stage
                        )}`}
                      >
                        {formatStage(opportunity.stage)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-100">
                        {opportunity.amount
                          ? formatCurrency(opportunity.amount)
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-100">
                        {formatDate(opportunity.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-300 bg-gray-600/30 px-2 py-1 rounded">
                        {opportunity.leadId}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Opportunities;
