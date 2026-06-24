import { useState, useEffect } from 'react';

/**
 * Custom hook to calculate the optimal grid layout based on the number of participants.
 * @param {number} participantCount - Total number of participants to display in the grid.
 * @returns {object} { gridCols, gridRows }
 */
export const useGridLayout = (participantCount) => {
  const [layout, setLayout] = useState({ gridCols: 1, gridRows: 1 });

  useEffect(() => {
    const calculateLayout = () => {
      let cols = 1;
      let rows = 1;
      const isMobile = window.innerWidth < 640;

      if (participantCount === 1) {
        cols = 1;
        rows = 1;
      } else if (participantCount === 2) {
        cols = isMobile ? 1 : 2;
        rows = isMobile ? 2 : 1;
      } else if (participantCount >= 3 && participantCount <= 4) {
        cols = isMobile ? 1 : 2;
        rows = isMobile ? participantCount : 2;
      } else if (participantCount >= 5 && participantCount <= 6) {
        cols = isMobile ? 2 : 3;
        rows = isMobile ? 3 : 2;
      } else if (participantCount >= 7 && participantCount <= 9) {
        cols = isMobile ? 2 : 3;
        rows = isMobile ? Math.ceil(participantCount/2) : 3;
      } else {
        cols = isMobile ? 2 : 4;
        rows = isMobile ? Math.ceil(participantCount/2) : Math.ceil(participantCount/4);
      }

      setLayout({ gridCols: cols, gridRows: rows });
    };

    calculateLayout();
    window.addEventListener('resize', calculateLayout);
    return () => window.removeEventListener('resize', calculateLayout);
  }, [participantCount]);

  return layout;
};
