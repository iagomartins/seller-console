import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should debounce value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    expect(result.current).toBe("initial");

    // Change value
    rerender({ value: "updated", delay: 500 });
    expect(result.current).toBe("initial"); // Should still be initial

    // Fast forward time by 250ms (less than delay)
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe("initial"); // Should still be initial

    // Fast forward time by another 250ms (total 500ms)
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe("updated"); // Should now be updated
  });

  it("should reset timer on rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    // Change value multiple times rapidly
    rerender({ value: "first", delay: 500 });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: "second", delay: 500 });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: "third", delay: 500 });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe("initial"); // Should still be initial

    // Fast forward to complete the delay
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("third"); // Should be the last value
  });

  it("should work with different delay values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 1000 },
      }
    );

    rerender({ value: "updated", delay: 1000 });

    // Fast forward by 500ms (less than delay)
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("initial");

    // Fast forward by another 500ms (total 1000ms)
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("updated");
  });

  it("should work with zero delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 0 },
      }
    );

    rerender({ value: "updated", delay: 0 });

    // With zero delay, should update immediately
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current).toBe("updated");
  });

  it("should work with different data types", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 0, delay: 100 },
      }
    );

    rerender({ value: 42, delay: 100 });

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe(42);

    // Test with boolean
    rerender({ value: true, delay: 100 });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe(true);

    // Test with object
    const obj = { name: "test" };
    rerender({ value: obj, delay: 100 });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe(obj);
  });

  it("should cleanup timer on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const { unmount } = renderHook(() => useDebounce("test", 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
