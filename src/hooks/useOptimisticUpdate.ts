import { useState, useCallback } from "react";

// Custom hook for optimistic updates with rollback capability
export const useOptimisticUpdate = <T>(initialData: T) => {
  const [data, setData] = useState<T>(initialData);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const optimisticUpdate = useCallback(
    async (
      updateFn: (currentData: T) => T,
      rollbackFn: (originalData: T) => T,
      asyncFn: () => Promise<T>
    ) => {
      setIsUpdating(true);
      setError(null);

      // Store original data for potential rollback
      const originalData = data;

      try {
        // Apply optimistic update
        const optimisticData = updateFn(data);
        setData(optimisticData);

        // Perform actual async operation
        const result = await asyncFn();

        // Update with actual result
        setData(result);
        setIsUpdating(false);

        return result;
      } catch (err) {
        // Rollback on error
        if (rollbackFn) {
          setData(rollbackFn(originalData));
        } else {
          setData(originalData);
        }

        setError(err instanceof Error ? err.message : "An error occurred");
        setIsUpdating(false);
        throw err;
      }
    },
    [data]
  );

  return {
    data,
    isUpdating,
    error,
    optimisticUpdate,
    setData,
  };
};
