import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useDebounce } from "../../hooks/useDebounce";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../utils/localStorage";
import {
  formatScore,
  getScoreColor,
  getStatusColor,
  getSourceColor,
  formatSource,
} from "../../utils/format";
import { LeadStatus, LeadSource, LeadFilters, SortOptions } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faSortAmountDown,
  faSortAmountUp,
  faEye,
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import LoadingSpinner from "../ui/LoadingSpinner";
import EmptyState from "../ui/EmptyState";

interface LeadsListProps {
  onLeadSelect?: () => void;
}

const LeadsList: React.FC<LeadsListProps> = ({ onLeadSelect }) => {
  const {
    leads,
    loading,
    error,
    searchQuery,
    filters,
    sortOptions,
    searchLeads,
    setSearchQuery,
    setFilters,
    setSortOptions,
    selectLead,
    clearError,
  } = useApp();

  const [localSearchQuery, setLocalSearchQuery] = useState<string>(searchQuery);
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  // Persist search query in localStorage
  const [persistedFilters, setPersistedFilters] = useLocalStorage<LeadFilters>(
    STORAGE_KEYS.FILTERS,
    filters
  );
  const [persistedSortOptions, setPersistedSortOptions] =
    useLocalStorage<SortOptions>(STORAGE_KEYS.SORT_OPTIONS, sortOptions);

  // Load persisted state on mount
  useEffect(() => {
    if (persistedFilters) {
      setFilters(persistedFilters);
    }
    if (persistedSortOptions) {
      setSortOptions(persistedSortOptions);
    }
  }, []);

  // Handle search
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setSearchQuery(debouncedSearchQuery);
      searchLeads(debouncedSearchQuery, filters);
    }
  }, [debouncedSearchQuery, filters]);

  // Handle filter changes
  const handleFilterChange = (filterType: keyof LeadFilters, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    setPersistedFilters(newFilters);
    searchLeads(debouncedSearchQuery, newFilters);
  };

  // Handle sort changes
  useEffect(() => {
    searchLeads(debouncedSearchQuery, filters, sortOptions);
  }, [sortOptions]);

  const handleSortChange = (field: string) => {
    const direction: "asc" | "desc" =
      sortOptions.field === field && sortOptions.direction === "desc"
        ? "asc"
        : "desc";
    const newSortOptions = { field, direction };
    setSortOptions(newSortOptions);
    setPersistedSortOptions(newSortOptions);
    // Trigger re-search with new sort options
    searchLeads(debouncedSearchQuery, filters, newSortOptions);
  };

  // Clear filters
  const clearFilters = () => {
    const clearedFilters: LeadFilters = { status: "", source: "" };
    setFilters(clearedFilters);
    setPersistedFilters(clearedFilters);
    searchLeads(debouncedSearchQuery, clearedFilters);
  };

  const statusOptions = [
    { value: "", label: "All Statuses" },
    ...Object.entries(LeadStatus).map(([key, value]) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
      key,
    })),
  ];

  const sourceOptions = [
    { value: "", label: "All Sources" },
    ...Object.entries(LeadSource).map(([key, value]) => ({
      value,
      label: formatSource(value),
      key,
    })),
  ];

  const getSortIcon = (field: string) => {
    if (sortOptions.field !== field) return faSortAmountDown;
    return sortOptions.direction === "desc" ? faSortAmountDown : faSortAmountUp;
  };

  if (error) {
    return (
      <div className="bg-gray-700 border border-gray-600 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="h-6 w-6 text-red-400"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-red-400 mb-2">
              Error loading leads
            </h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={clearError}>
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Try Again
            </Button>
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
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Leads</h1>
          <p className="text-gray-300">
            {leads.length} lead{leads.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-700 border border-gray-600 rounded-2xl p-6 shadow-lg mb-10">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <Input
                placeholder="Search leads by name, company, or email..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                icon={
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                }
              />
            </div>
            <Select
              options={statusOptions}
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              placeholder="Filter by status"
            />
            <Select
              options={sourceOptions}
              value={filters.source}
              onChange={(e) => handleFilterChange("source", e.target.value)}
              placeholder="Filter by source"
            />
          </div>

          {(filters.status || filters.source) && (
            <div className="flex items-center justify-between p-3 bg-gray-600/30 rounded-xl">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <FontAwesomeIcon icon={faFilter} />
                <span>
                  Filters:{" "}
                  {[filters.status, filters.source].filter(Boolean).join(", ")}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <FontAwesomeIcon icon={faTimes} className="mr-1" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Empty State */}
      {!loading && leads.length === 0 && (
        <EmptyState
          title="No leads found"
          description="Try adjusting your search criteria or filters to find more leads."
          action={
            <Button variant="outline" onClick={clearFilters}>
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              Clear Filters
            </Button>
          }
        />
      )}

      {/* Leads Table */}
      {!loading && leads.length > 0 && (
        <div className="bg-gray-700 border border-gray-600 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-600/50">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                    <button
                      onClick={() => handleSortChange("name")}
                      className="flex items-center space-x-2 hover:text-gray-100 transition-colors"
                    >
                      <span>Name</span>
                      <FontAwesomeIcon
                        icon={getSortIcon("name")}
                        className="h-3 w-3"
                      />
                    </button>
                  </th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Company
                  </th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Email
                  </th>
                  <th className="hidden lg:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Source
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                    <button
                      onClick={() => handleSortChange("score")}
                      className="flex items-center space-x-2 hover:text-gray-100 transition-colors"
                    >
                      <span>Score</span>
                      <FontAwesomeIcon
                        icon={getSortIcon("score")}
                        className="h-3 w-3"
                      />
                    </button>
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-700 divide-y divide-gray-600">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-gray-600 hover:bg-gray-600/30 transition-colors duration-200 cursor-pointer"
                    onClick={() => {
                      selectLead(lead);
                      onLeadSelect?.();
                    }}
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-100">
                        {lead.name}
                      </div>
                      <div className="sm:hidden text-xs text-gray-300 mt-1">
                        {lead.company}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-100">
                        {lead.company}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-100">{lead.email}</div>
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getSourceColor(
                          lead.source
                        )}`}
                      >
                        {formatSource(lead.source)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getScoreColor(
                          lead.score
                        )}`}
                      >
                        {formatScore(lead.score)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          lead.status
                        )}`}
                      >
                        {lead.status.charAt(0).toUpperCase() +
                          lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectLead(lead);
                          onLeadSelect?.();
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </Button>
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

export default LeadsList;
