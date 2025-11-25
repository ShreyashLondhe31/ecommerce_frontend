import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { useContext, createContext, useState, useEffect } from "react";


const SidebarContext = createContext();

export default function Sidebar({ children, isDrawerOpen, setIsDrawerOpen }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (isDrawerOpen) {
      setExpanded(true);
    }
  }, [isDrawerOpen]);

  return (
    <aside
      className={`fixed z-20 left-0 top-1/2 -translate-y-1/2 
                  transition-transform duration-300
                  ${
                    isDrawerOpen
                      ? "translate-x-0"
                      : "-translate-x-full md:translate-x-0"
                  }`}
    >
      <nav className="h-auto inline-flex flex-col bg-white/80 backdrop-blur-sm border-r border-t border-b rounded-r-lg shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          />
          {/* MODIFICATION HERE: 
            - Replaced 'p-1.5' with explicit 'h-9' and 'w-9'
            - for perfect centering.
          */}
          <button
            onClick={() => {
              const newExpanded = !expanded;
              setExpanded(newExpanded);

              if (!newExpanded) {
                setIsDrawerOpen(false);
              }
            }}
            className="h-9 w-9 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul
            className={`
              flex-1 px-3 overflow-hidden transition-all duration-300
              ${expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            {children}
          </ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

// --- No changes are needed for SidebarItem ---
export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
    `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-28 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  );
}