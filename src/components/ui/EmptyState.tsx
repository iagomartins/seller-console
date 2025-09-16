import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="mx-auto h-16 w-16 text-dark-text-muted mb-4">
        {Icon ? (
          <Icon className="h-full w-full" />
        ) : (
          <FontAwesomeIcon icon={faInbox} className="h-full w-full" />
        )}
      </div>
      <h3 className="text-lg font-medium text-dark-text mb-2">{title}</h3>
      {description && (
        <p className="text-dark-text-muted mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
