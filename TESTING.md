# Testing Guide

This project uses Jest and React Testing Library for comprehensive testing of all key functionalities.

## Test Structure

```
src/
├── __tests__/                    # Integration tests
│   ├── App.test.tsx
│   ├── integration.test.tsx
│   └── test-setup.ts
├── components/
│   ├── features/__tests__/       # Feature component tests
│   │   ├── LeadsList.test.tsx
│   │   ├── LeadDetailPanel.test.tsx
│   │   └── Opportunities.test.tsx
│   └── ui/__tests__/             # UI component tests
│       ├── Button.test.tsx
│       └── Input.test.tsx
├── context/__tests__/            # Context tests
│   └── AppContext.test.tsx
├── hooks/__tests__/              # Custom hook tests
│   ├── useDebounce.test.ts
│   └── useLocalStorage.test.ts
├── services/__tests__/           # Service tests
│   └── leadService.test.ts
├── types/__tests__/              # Type/validation tests
│   └── validation.test.ts
└── utils/__tests__/              # Utility function tests
    └── format.test.ts
```

## Test Categories

### 1. Unit Tests

- **Utility Functions** (`src/utils/__tests__/`): Test formatting, validation, and helper functions
- **Custom Hooks** (`src/hooks/__tests__/`): Test useDebounce and useLocalStorage hooks
- **Services** (`src/services/__tests__/`): Test leadService API calls and business logic
- **Types/Validation** (`src/types/__tests__/`): Test validation functions and type factories

### 2. Component Tests

- **UI Components** (`src/components/ui/__tests__/`): Test reusable UI components like Button, Input
- **Feature Components** (`src/components/features/__tests__/`): Test main feature components like LeadsList, LeadDetailPanel, Opportunities

### 3. Integration Tests

- **Context Tests** (`src/context/__tests__/`): Test AppContext state management and actions
- **App Tests** (`src/__tests__/App.test.tsx`): Test main App component functionality
- **End-to-End Flows** (`src/__tests__/integration.test.tsx`): Test complete user workflows

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

## Test Coverage

The test suite aims for 80% coverage across:

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Key Test Scenarios

### Lead Management Flow

1. **View Leads**: Load and display leads list
2. **Search Leads**: Search by name, company, or email
3. **Filter Leads**: Filter by status and source
4. **Sort Leads**: Sort by name and score
5. **Select Lead**: Open lead detail panel
6. **Edit Lead**: Modify lead information with validation
7. **Convert Lead**: Convert lead to opportunity

### Opportunity Management Flow

1. **View Opportunities**: Display converted leads as opportunities
2. **Navigate Tabs**: Switch between leads and opportunities
3. **Mobile Navigation**: Test mobile menu functionality

### Error Handling

1. **Service Errors**: Handle API failures gracefully
2. **Validation Errors**: Show appropriate error messages
3. **Network Issues**: Retry mechanisms and fallbacks

### Performance

1. **Large Datasets**: Handle 1000+ leads efficiently
2. **Debounced Search**: Prevent excessive API calls
3. **State Management**: Efficient context updates

## Mocking Strategy

- **Services**: Mock leadService API calls
- **Hooks**: Mock useDebounce and useLocalStorage
- **Icons**: Mock FontAwesome icons
- **Browser APIs**: Mock localStorage, matchMedia, etc.

## Test Utilities

- **Custom Render**: Wrapper components for context providers
- **Mock Data**: Consistent test data across all tests
- **User Events**: Realistic user interactions
- **Async Testing**: Proper handling of async operations

## Best Practices

1. **Arrange-Act-Assert**: Clear test structure
2. **Descriptive Names**: Test names that explain the scenario
3. **Single Responsibility**: One test per behavior
4. **Mock External Dependencies**: Isolate units under test
5. **Test User Interactions**: Focus on user behavior, not implementation
6. **Cleanup**: Proper cleanup after each test
7. **Accessibility**: Test keyboard navigation and screen readers

## Debugging Tests

```bash
# Run specific test file
npm test LeadsList.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render leads list"

# Run tests with verbose output
npm test -- --verbose

# Debug tests in VS Code
# Use Jest extension and set breakpoints
```

## Continuous Integration

Tests run automatically on:

- Pull requests
- Main branch pushes
- Scheduled runs

Coverage reports are generated and uploaded to CI artifacts.
