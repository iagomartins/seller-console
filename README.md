# Seller Console

A lightweight React application for triaging leads and converting them into opportunities. Built with modern React patterns, Tailwind CSS, and Vite for optimal performance.

### Why Dark Layouts Are Better for Users' Vision

Dark layouts reduce eye strain in low-light environments. When using a device in a dark room or at night, a dark theme minimizes the amount of bright light emitted by the screen. This can help reduce eye discomfort and make it easier to focus on the content. Additionally, dark themes can also help reduce blue light exposure, which some studies suggest may contribute to digital eye strain.

## Features

### Core Functionality

- **Leads Management**: View, search, filter, and sort leads
- **Lead Details**: Inline editing with validation
- **Opportunity Conversion**: Convert qualified leads to opportunities
- **Real-time Search**: Debounced search across name, company, and email
- **Advanced Filtering**: Filter by status and source
- **Smart Sorting**: Sort by score and name with visual indicators

### User Experience

- **Responsive Design**: Optimized for desktop and mobile devices
- **Loading States**: Smooth loading indicators throughout the app
- **Error Handling**: Comprehensive error states with retry options
- **Empty States**: Helpful empty state messages with actions
- **Optimistic Updates**: Immediate UI updates with rollback on failure
- **Persistence**: Filter and sort preferences saved in localStorage

### Technical Features

- **Modern React**: Hooks, Context API, and functional components
- **Clean Architecture**: Scalable folder structure with separation of concerns
- **Type Safety**: Comprehensive data validation and type checking
- **Performance**: Optimized with debouncing and efficient re-renders
- **Accessibility**: Keyboard navigation and screen reader support

## Tech Stack

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management
- **Custom Hooks** - Reusable logic
- **Local Storage** - Data persistence
- **Jest** - Unit Tests
## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── EmptyState.tsx
│   └── features/           # Feature-specific components
│       ├── LeadsList.tsx
│       ├── LeadDetailPanel.tsx
│       └── Opportunities.tsx
├── context/                # React Context for state management
│   └── AppContext.tsx
├── hooks/                  # Custom React hooks
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   └── useOptimisticUpdate.ts
├── services/               # Data layer
│   └── leadService.ts
├── types/                  # Data models and validation
│   └── index.ts
├── utils/                  # Utility functions
│   ├── localStorage.ts
│   └── format.ts
├── data/                   # Mock data
│   ├── leads.json
│   └── generateMockData.ts
├── App.tsx                  # Main application component
└── index.tsx               # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd seller-console
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open your browser and navigate to `[http://localhost:5173](http://localhost:5173/)`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests

## Usage

### Managing Leads

1. **View Leads**: The main page shows all leads in a sortable table
2. **Search**: Use the search bar to find leads by name, company, or email
3. **Filter**: Use the dropdown filters to filter by status or source
4. **Sort**: Click column headers to sort by name or score
5. **View Details**: Click on any lead row to open the detail panel

### Editing Leads

1. Click "View Details" on any lead
2. Click "Edit Lead" in the detail panel
3. Modify the lead information
4. Click "Save Changes" to save or "Cancel" to discard

### Converting Leads

1. Open a lead's detail panel
2. Click "Convert to Opportunity"
3. The lead will be converted and moved to the Opportunities tab

### Managing Opportunities

1. Switch to the "Opportunities" tab
2. View all converted opportunities
3. See lead source information and conversion details

## Data Model

### Lead

- `id`: Unique identifier
- `name`: Lead's full name
- `company`: Company name
- `email`: Email address (validated)
- `source`: Lead source (website, referral, etc.)
- `score`: Lead score (0-100)
- `status`: Lead status (new, contacted, qualified, etc.)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Opportunity

- `id`: Unique identifier
- `name`: Opportunity name
- `stage`: Sales stage
- `amount`: Deal amount (optional)
- `accountName`: Account name
- `leadId`: Source lead ID
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Design Patterns

### Component Architecture

- **Atomic Design**: UI components follow atomic design principles
- **Container/Presentational**: Separation of logic and presentation
- **Compound Components**: Complex components built from simpler ones

### State Management

- **Context API**: Global state management
- **Local State**: Component-specific state
- **Custom Hooks**: Reusable stateful logic

### Error Handling

- **Error Boundaries**: Catch and handle React errors
- **Validation**: Client-side form validation
- **User Feedback**: Clear error messages and retry options

### Performance

- **Debouncing**: Search input debouncing
- **Memoization**: Optimized re-renders
- **Lazy Loading**: Code splitting for better performance

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
