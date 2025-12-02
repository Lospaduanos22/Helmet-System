import { useState, useEffect } from "react";
import ApiService from "../services/ApiService";

const HelmetDeposit = () => {
  const [lockers, setLockers] = useState([]);
  const [message, setMessage] = useState("");
  
  // Retrieve logged-in student info
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    fetchLockers();
  }, []);

  const fetchLockers = async () => {
    try {
      const res = await ApiService.getAllLockers();
      if (res.success) setLockers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReserve = async (locker) => {
    if (locker.status !== 'available') return;

    const confirm = window.confirm(`Confirm reservation for Locker ${locker.locker_number}?`);
    if (!confirm) return;

    try {
      const res = await ApiService.reserveLocker(locker.locker_id, studentId);
      setMessage(res.success ? "Reservation successful!" : res.message);
      if (res.success) fetchLockers();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Reserve a Locker</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
          {message}
        </div>
      )}

      <div className="grid grid-cols-5 gap-4">
        {lockers.map((locker) => {
          const isMine = locker.student_id === studentId;
          
          return (
            <button
              key={locker.locker_id}
              disabled={locker.status !== 'available'}
              onClick={() => handleReserve(locker)}
              className={`
                h-24 border-2 rounded-lg flex flex-col items-center justify-center transition-all
                ${isMine 
                  ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-300' 
                  : locker.status === 'occupied' 
                    ? 'bg-gray-200 border-gray-400 cursor-not-allowed opacity-60' 
                    : 'bg-white border-green-500 hover:bg-green-50 cursor-pointer shadow-sm hover:shadow-md'
                }
              `}
            >
              <span className="font-bold text-lg">{locker.locker_number}</span>
              <span className="text-xs mt-1">
                {isMine ? "(Your Locker)" : locker.status}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HelmetDeposit;