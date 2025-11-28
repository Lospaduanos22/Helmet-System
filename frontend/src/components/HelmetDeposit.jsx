import React, { useState, useEffect } from "react";

export default function HelmetDeposit({ studentId }) {
  const TOTAL_ROWS = 8;
  const TOTAL_COLS = 5;

  const [slots, setSlots] = useState([]);

  useEffect(() => {
    // Placeholder — later fetch from database
    const initialSlots = Array(TOTAL_ROWS * TOTAL_COLS).fill(null);
    setSlots(initialSlots);
  }, []);

  const handleSelectSlot = (index) => {
    if (slots[index] !== null) return; // Already reserved

    const updated = [...slots];
    updated[index] = {
      studentId,
      time: new Date().toISOString(),
    };

    setSlots(updated);

    console.log("Slot selected:", index, updated[index]);

    // TODO: ApiService.saveSlot(index, studentId)
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Helmet Deposit Slots</h2>

      <div className="grid grid-cols-5 gap-3">
        {slots.map((slot, index) => (
          <button
            key={index}
            onClick={() => handleSelectSlot(index)}
            className={`p-6 rounded-xl font-bold transition shadow-lg
              ${slot ? "bg-red-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}
            `}
          >
            {slot ? "Unavailable" : "Available"}
          </button>
        ))}
      </div>
    </div>
  );
}
