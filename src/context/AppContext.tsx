import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { leadService } from "../services/leadService";
import { Lead, Opportunity, LeadFilters, SortOptions } from "../types";

// Action types
export const ActionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_LEADS: "SET_LEADS",
  SET_OPPORTUNITIES: "SET_OPPORTUNITIES",
  UPDATE_LEAD: "UPDATE_LEAD",
  ADD_OPPORTUNITY: "ADD_OPPORTUNITY",
  SET_SELECTED_LEAD: "SET_SELECTED_LEAD",
  SET_SEARCH_QUERY: "SET_SEARCH_QUERY",
  SET_FILTERS: "SET_FILTERS",
  SET_SORT_OPTIONS: "SET_SORT_OPTIONS",
  CLEAR_ERROR: "CLEAR_ERROR",
} as const;

// Action interfaces
interface SetLoadingAction {
  type: typeof ActionTypes.SET_LOADING;
  payload: boolean;
}

interface SetErrorAction {
  type: typeof ActionTypes.SET_ERROR;
  payload: string;
}

interface SetLeadsAction {
  type: typeof ActionTypes.SET_LEADS;
  payload: Lead[];
}

interface SetOpportunitiesAction {
  type: typeof ActionTypes.SET_OPPORTUNITIES;
  payload: Opportunity[];
}

interface UpdateLeadAction {
  type: typeof ActionTypes.UPDATE_LEAD;
  payload: Lead;
}

interface AddOpportunityAction {
  type: typeof ActionTypes.ADD_OPPORTUNITY;
  payload: Opportunity;
}

interface SetSelectedLeadAction {
  type: typeof ActionTypes.SET_SELECTED_LEAD;
  payload: Lead | null;
}

interface SetSearchQueryAction {
  type: typeof ActionTypes.SET_SEARCH_QUERY;
  payload: string;
}

interface SetFiltersAction {
  type: typeof ActionTypes.SET_FILTERS;
  payload: Partial<LeadFilters>;
}

interface SetSortOptionsAction {
  type: typeof ActionTypes.SET_SORT_OPTIONS;
  payload: Partial<SortOptions>;
}

interface ClearErrorAction {
  type: typeof ActionTypes.CLEAR_ERROR;
}

type Action =
  | SetLoadingAction
  | SetErrorAction
  | SetLeadsAction
  | SetOpportunitiesAction
  | UpdateLeadAction
  | AddOpportunityAction
  | SetSelectedLeadAction
  | SetSearchQueryAction
  | SetFiltersAction
  | SetSortOptionsAction
  | ClearErrorAction;

// State interface
interface AppState {
  leads: Lead[];
  opportunities: Opportunity[];
  selectedLead: Lead | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: LeadFilters;
  sortOptions: SortOptions;
}

// Initial state
const initialState: AppState = {
  leads: [],
  opportunities: [],
  selectedLead: null,
  loading: false,
  error: null,
  searchQuery: "",
  filters: {
    status: "",
    source: "",
  },
  sortOptions: {
    field: "score",
    direction: "desc",
  },
};

// Reducer
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };

    case ActionTypes.SET_LEADS:
      return { ...state, leads: action.payload, loading: false };

    case ActionTypes.SET_OPPORTUNITIES:
      return { ...state, opportunities: action.payload };

    case ActionTypes.UPDATE_LEAD:
      return {
        ...state,
        leads: state.leads.map((lead) =>
          lead.id === action.payload.id ? action.payload : lead
        ),
        selectedLead:
          state.selectedLead?.id === action.payload.id
            ? action.payload
            : state.selectedLead,
      };

    case ActionTypes.ADD_OPPORTUNITY:
      return {
        ...state,
        opportunities: [...state.opportunities, action.payload],
      };

    case ActionTypes.SET_SELECTED_LEAD:
      return { ...state, selectedLead: action.payload };

    case ActionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };

    case ActionTypes.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case ActionTypes.SET_SORT_OPTIONS:
      return {
        ...state,
        sortOptions: { ...state.sortOptions, ...action.payload },
      };

    default:
      return state;
  }
};

// Context interface
interface AppContextType extends AppState {
  searchLeads: (
    query: string,
    filters: LeadFilters,
    sortOptions?: SortOptions
  ) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<Lead>;
  convertToOpportunity: (
    leadId: string,
    opportunityData?: Partial<Opportunity>
  ) => Promise<Opportunity>;
  selectLead: (lead: Lead | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<LeadFilters>) => void;
  setSortOptions: (sortOptions: Partial<SortOptions>) => void;
  clearError: () => void;
}

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component props
interface AppProviderProps {
  children: ReactNode;
}

// Provider component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async (): Promise<void> => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const [leads, opportunities] = await Promise.all([
        leadService.getLeads(),
        leadService.getOpportunities(),
      ]);
      dispatch({ type: ActionTypes.SET_LEADS, payload: leads });
      dispatch({ type: ActionTypes.SET_OPPORTUNITIES, payload: opportunities });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const searchLeads = async (
    query: string,
    filters: LeadFilters,
    sortOptions?: SortOptions
  ): Promise<void> => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const leads = await leadService.searchLeads(
        query,
        filters,
        sortOptions || state.sortOptions
      );
      dispatch({ type: ActionTypes.SET_LEADS, payload: leads });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const updateLead = async (
    id: string,
    updates: Partial<Lead>
  ): Promise<Lead> => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const updatedLead = await leadService.updateLead(id, updates);
      dispatch({ type: ActionTypes.UPDATE_LEAD, payload: updatedLead });
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      return updatedLead;
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error instanceof Error ? error.message : "An error occurred",
      });
      throw error;
    }
  };

  const convertToOpportunity = async (
    leadId: string,
    opportunityData?: Partial<Opportunity>
  ): Promise<Opportunity> => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const opportunity = await leadService.convertToOpportunity(
        leadId,
        opportunityData
      );
      dispatch({ type: ActionTypes.ADD_OPPORTUNITY, payload: opportunity });

      // Update the lead in the leads list
      const updatedLead = await leadService.getLeadById(leadId);
      if (updatedLead) {
        dispatch({ type: ActionTypes.UPDATE_LEAD, payload: updatedLead });
      }

      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      return opportunity;
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error instanceof Error ? error.message : "An error occurred",
      });
      throw error;
    }
  };

  const selectLead = (lead: Lead | null): void => {
    dispatch({ type: ActionTypes.SET_SELECTED_LEAD, payload: lead });
  };

  const setSearchQuery = (query: string): void => {
    dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: query });
  };

  const setFilters = (filters: Partial<LeadFilters>): void => {
    dispatch({ type: ActionTypes.SET_FILTERS, payload: filters });
  };

  const setSortOptions = (sortOptions: Partial<SortOptions>): void => {
    dispatch({ type: ActionTypes.SET_SORT_OPTIONS, payload: sortOptions });
  };

  const clearError = (): void => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  const value: AppContextType = {
    ...state,
    searchLeads,
    updateLead,
    convertToOpportunity,
    selectLead,
    setSearchQuery,
    setFilters,
    setSortOptions,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
