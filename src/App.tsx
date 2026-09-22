import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { HomeView } from './views/HomeView.tsx';
import { TrackView } from './views/TrackView.tsx';
import { TrackingResultView } from './views/TrackingResultView.tsx';
import { NotFoundView } from './views/NotFoundView.tsx';
import { FaqView } from './views/FaqView.tsx';
import { ContactView } from './views/ContactView.tsx';
import { CustomerShipmentView } from './types.ts';
import { lookupShipment } from './services/trackingService.ts';
import { AlertTriangle, RefreshCw } from 'lucide-react';

type ViewMode = 'home' | 'track' | 'faq' | 'contact';
type SearchState = 'idle' | 'loading' | 'found' | 'not_found' | 'error';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewMode>('home');
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [shipmentData, setShipmentData] = useState<CustomerShipmentView | null>(null);
  const [searchedCode, setSearchedCode] = useState<string>('');
  const [systemErrorMessage, setSystemErrorMessage] = useState<string | null>(null);
  const [notFoundDetails, setNotFoundDetails] = useState<string | null>(null);

  // Check URL query param on initial load (e.g. ?code=TRK7A92X4B1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    if (codeParam && codeParam.trim().length === 11) {
      handleTrack(codeParam.trim());
    }
  }, []);

  const handleTrack = async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    setSearchedCode(trimmed);
    setSearchState('loading');
    setSystemErrorMessage(null);
    setNotFoundDetails(null);

    // Update URL quietly without full reload
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('code', trimmed);
      window.history.pushState({}, '', url.toString());
    } catch (_e) {
      // Ignore URL pushState errors in sandboxed iframes
    }

    try {
      const result = await lookupShipment(trimmed);

      if (result.success) {
        setShipmentData(result.data);
        setSearchState('found');
      } else if (result.error === 'NOT_FOUND') {
        setShipmentData(null);
        setNotFoundDetails(result.details || null);
        setSearchState('not_found');
      } else {
        setShipmentData(null);
        setSystemErrorMessage(
          result.details || 'Something went wrong while retrieving your shipment. Please try again later.'
        );
        setSearchState('error');
      }
    } catch (_err) {
      setShipmentData(null);
      setSystemErrorMessage('Something went wrong while retrieving your shipment. Please try again later.');
      setSearchState('error');
    }
  };

  const handleNavigate = (tab: ViewMode) => {
    setCurrentTab(tab);
    // If user navigates explicitly to home or track, reset result state to allow a fresh lookup
    if (tab === 'home') {
      setSearchState('idle');
      setShipmentData(null);
    } else if (tab === 'track') {
      if (searchState !== 'found') {
        setSearchState('idle');
        setShipmentData(null);
      }
    } else if (tab === 'faq') {
      // Keep state intact
    }
  };

  const handleBackToSearch = () => {
    setSearchState('idle');
    setShipmentData(null);
    setCurrentTab('track');
  };

  const handleBackToHome = () => {
    setSearchState('idle');
    setShipmentData(null);
    setCurrentTab('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0E1116] text-slate-100 font-sans selection:bg-[#FFE600] selection:text-black">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onTrackCode={handleTrack}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        {/* Navigation Tab Views */}
        {currentTab === 'contact' ? (
          <ContactView onTrackNavigate={() => handleNavigate('track')} />
        ) : currentTab === 'faq' ? (
          <FaqView onTrackNavigate={() => handleNavigate('track')} />
        ) : searchState === 'found' && shipmentData ? (
          <TrackingResultView
            shipment={shipmentData}
            onTrackNew={handleTrack}
            onBackToSearch={handleBackToSearch}
          />
        ) : searchState === 'not_found' ? (
          <NotFoundView
            attemptedCode={searchedCode}
            details={notFoundDetails}
            onTrack={handleTrack}
            onBackToHome={handleBackToHome}
            isLoading={false}
          />
        ) : searchState === 'error' ? (
          <div className="w-full min-h-[50vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full p-8 rounded-3xl bg-[#151921] border border-red-500/30 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-7 h-7 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-white">System Error</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {systemErrorMessage || 'Something went wrong while retrieving your shipment. Please try again later.'}
              </p>
              <button
                onClick={() => handleTrack(searchedCode)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FFE600] text-[#0E1116] hover:bg-[#F2D900] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Search</span>
              </button>
            </div>
          </div>
        ) : currentTab === 'track' ? (
          <TrackView
            onTrack={handleTrack}
            isLoading={searchState === 'loading'}
          />
        ) : (
          <HomeView
            onTrack={handleTrack}
            isLoading={searchState === 'loading'}
          />
        )}
      </main>

      {/* Site Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Fixed Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
