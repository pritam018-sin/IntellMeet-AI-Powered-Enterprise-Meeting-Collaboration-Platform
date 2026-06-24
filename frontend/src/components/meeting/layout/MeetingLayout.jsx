import React from 'react';

/**
 * Main Meeting Layout wrapper.
 * Handles the overall grid layout, separating the main video area from the sidebar.
 */
const MeetingLayout = ({ children, isSidebarOpen, sidebarContent }) => {
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-[#050000] via-[#110000] to-[#2a0808] text-white overflow-hidden relative">
      {/* Main Video Area */}
      <div 
        className={`flex flex-col h-full transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-full lg:w-[75%] xl:w-[80%]' : 'w-full'}
        `}
      >
        {children}
      </div>

      {/* Sidebar Area */}
      <div 
        className={`absolute lg:relative right-0 top-0 h-full bg-slate-900 border-l border-slate-800 transform transition-transform duration-300 ease-in-out z-20
          w-full sm:w-[320px] md:w-[400px] lg:w-[25%] xl:w-[20%]
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:hidden'}
        `}
        style={{ display: isSidebarOpen ? 'block' : 'none' }} // Hide on desktop when closed to avoid taking space
      >
        {sidebarContent}
      </div>

      {/* Overlay for mobile/tablet when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden absolute inset-0 bg-black/50 z-10"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default MeetingLayout;
