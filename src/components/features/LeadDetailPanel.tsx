import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { validateEmail, validateLead, LeadStatus, Lead } from "../../types";
import { formatRelativeDate } from "../../utils/format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faEdit,
  faSave,
  faTimes as faCancel,
  faExchangeAlt,
  faExclamationTriangle,
  faUser,
  faChartBar,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import LoadingSpinner from "../ui/LoadingSpinner";

interface LeadDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadDetailPanel: React.FC<LeadDetailPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    selectedLead,
    loading,
    error,
    updateLead,
    convertToOpportunity,
    clearError,
  } = useApp();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedLead, setEditedLead] = useState<Lead | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isConverting, setIsConverting] = useState<boolean>(false);

  // Initialize edited lead when selectedLead changes
  useEffect(() => {
    if (selectedLead) {
      setEditedLead({ ...selectedLead });
      setValidationErrors({});
    }
  }, [selectedLead]);

  const handleInputChange = (field: keyof Lead, value: string | number) => {
    if (!editedLead) return;

    setEditedLead((prev) => (prev ? { ...prev, [field]: value } : null));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleEmailChange = (value: string) => {
    handleInputChange("email", value);

    // Validate email format
    if (value && !validateEmail(value)) {
      setValidationErrors((prev) => ({
        ...prev,
        email: "Invalid email format",
      }));
    }
  };

  const handleSave = async () => {
    if (!editedLead) return;

    const validation = validateLead(editedLead);
    if (!validation.isValid) {
      const errors: Record<string, string> = {};
      validation.errors.forEach((error) => {
        if (error.includes("Name")) errors.name = error;
        if (error.includes("Company")) errors.company = error;
        if (error.includes("Email")) errors.email = error;
        if (error.includes("Score")) errors.score = error;
      });
      setValidationErrors(errors);
      return;
    }

    try {
      await updateLead(editedLead.id, {
        name: editedLead.name,
        company: editedLead.company,
        email: editedLead.email,
        status: editedLead.status,
        score: editedLead.score,
      });
      setIsEditing(false);
      setValidationErrors({});
    } catch (err) {
      console.error("Error updating lead:", err);
    }
  };

  const handleCancel = () => {
    setEditedLead(selectedLead ? { ...selectedLead } : null);
    setValidationErrors({});
    setIsEditing(false);
  };

  const handleConvertToOpportunity = async () => {
    if (!selectedLead) return;

    setIsConverting(true);
    try {
      await convertToOpportunity(selectedLead.id, {
        name: selectedLead.name,
        accountName: selectedLead.company,
      });
      onClose();
    } catch (err) {
      console.error("Error converting lead:", err);
    } finally {
      setIsConverting(false);
    }
  };

  const statusOptions = Object.entries(LeadStatus).map(([key, value]) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
    key,
  }));

  if (!isOpen || !selectedLead) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-md sm:max-w-lg bg-gray-700 shadow-2xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-100">
              Lead Details
            </h2>
            <button
              onClick={onClose}
              className="btn-primary p-2 rounded-xl text-gray-300 hover:text-gray-100 hover:bg-gray-600 transition-colors"
              aria-label="Close panel"
              title="Close panel"
            >
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {loading && (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="h-5 w-5 text-red-400 mt-0.5"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-red-400 mb-1">
                      Error
                    </h3>
                    <p className="text-sm text-red-300 mb-3">{error}</p>
                    <Button variant="outline" size="sm" onClick={clearError}>
                      <FontAwesomeIcon icon={faTimes} className="mr-1" />
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!loading && (
              <div className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="mr-2 text-gray-100"
                    />
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Name"
                      value={
                        isEditing ? editedLead?.name || "" : selectedLead.name
                      }
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      disabled={!isEditing}
                      error={validationErrors.name}
                    />

                    <Input
                      label="Company"
                      value={
                        isEditing
                          ? editedLead?.company || ""
                          : selectedLead.company
                      }
                      onChange={(e) =>
                        handleInputChange("company", e.target.value)
                      }
                      disabled={!isEditing}
                      error={validationErrors.company}
                    />

                    <Input
                      label="Email"
                      type="email"
                      value={
                        isEditing ? editedLead?.email || "" : selectedLead.email
                      }
                      onChange={(e) => handleEmailChange(e.target.value)}
                      disabled={!isEditing}
                      error={validationErrors.email}
                    />
                  </div>
                </div>

                {/* Lead Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
                    <FontAwesomeIcon
                      icon={faChartBar}
                      className="mr-2 text-gray-100"
                    />
                    Lead Details
                  </h3>
                  <div className="space-y-4">
                    <Select
                      label="Status"
                      value={
                        isEditing
                          ? editedLead?.status || ""
                          : selectedLead.status
                      }
                      onChange={(e) =>
                        handleInputChange("status", e.target.value as any)
                      }
                      options={statusOptions}
                      disabled={!isEditing}
                    />

                    <Input
                      label="Score"
                      type="number"
                      min="0"
                      max="100"
                      value={
                        isEditing ? editedLead?.score || "" : selectedLead.score
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "score",
                          parseInt(e.target.value) || 0
                        )
                      }
                      disabled={!isEditing}
                      error={validationErrors.score}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-100 mb-2">
                        Source
                      </label>
                      <div className="px-4 py-3 bg-gray-600/30 border border-gray-600 rounded-xl text-sm text-gray-100">
                        {selectedLead.source.charAt(0).toUpperCase() +
                          selectedLead.source.slice(1).replace("-", " ")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
                    <FontAwesomeIcon
                      icon={faIdCard}
                      className="mr-2 text-gray-100"
                    />
                    Metadata
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
                      <span className="text-gray-300">Created:</span>
                      <span className="text-gray-100">
                        {formatRelativeDate(selectedLead.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
                      <span className="text-gray-300">Updated:</span>
                      <span className="text-gray-100">
                        {formatRelativeDate(selectedLead.updatedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">Lead ID:</span>
                      <span className="font-mono text-xs text-gray-100 bg-gray-600/30 px-2 py-1 rounded">
                        {selectedLead.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-600 px-6 py-4">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              {isEditing ? (
                <>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    loading={loading}
                    className="flex-1"
                    icon={<FontAwesomeIcon icon={faSave} />}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                    icon={<FontAwesomeIcon icon={faCancel} />}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="flex-1"
                    icon={<FontAwesomeIcon icon={faEdit} />}
                  >
                    Edit Lead
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleConvertToOpportunity}
                    loading={isConverting}
                    disabled={selectedLead.status === "converted"}
                    className="flex-1"
                    icon={<FontAwesomeIcon icon={faExchangeAlt} />}
                  >
                    <span className="hidden sm:inline">
                      {selectedLead.status === "converted"
                        ? "Already Converted"
                        : "Convert to Opportunity"}
                    </span>
                    <span className="sm:hidden">
                      {selectedLead.status === "converted"
                        ? "Converted"
                        : "Convert"}
                    </span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailPanel;
