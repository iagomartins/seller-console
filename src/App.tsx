import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import LeadsList from "./components/features/LeadsList";
import LeadDetailPanel from "./components/features/LeadDetailPanel";
import Opportunities from "./components/features/Opportunities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faChartLine,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  const [activeTab, setActiveTab] = useState("leads");
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "leads", name: "Leads", icon: faUsers },
    { id: "opportunities", name: "Opportunities", icon: faChartLine },
  ];

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-800 text-gray-100">
        {/* Header */}
        <header className="bg-gray-700 shadow-lg border-b border-gray-600 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-2">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-100">
                  Mini Seller Console
                </h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`btn-primary flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-sky-600 text-white shadow-lg"
                        : "text-gray-900 hover:text-white hover:bg-blue-500"
                    }`}
                  >
                    <FontAwesomeIcon icon={tab.icon} className="mr-2 h-4 w-4" />
                    {tab.name}
                  </button>
                ))}
              </nav>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="btn-primary text-gray-900 hover:text-white p-2 rounded-lg hover:bg-blue-500 transition-colors duration-200"
                  aria-label="Toggle mobile menu"
                  title="Toggle mobile menu"
                >
                  <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t border-gray-600 py-4">
                <nav className="flex flex-col space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`btn-primary flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-sky-600 text-white"
                          : "text-gray-300 hover:text-white hover:bg-blue-500"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={tab.icon}
                        className="mr-3 h-4 w-4"
                      />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "leads" && (
            <LeadsList onLeadSelect={() => setIsDetailPanelOpen(true)} />
          )}
          {activeTab === "opportunities" && <Opportunities />}
        </main>

        {/* Lead Detail Slide-over Panel */}
        <LeadDetailPanel
          isOpen={isDetailPanelOpen}
          onClose={() => setIsDetailPanelOpen(false)}
        />
      </div>
    </AppProvider>
  );
}

export default App;
