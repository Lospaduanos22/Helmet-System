import { useState, useEffect } from "react";
import ApiService from "../services/ApiService";

const StudentLockers = ({ student }) => {
  const [clusters, setClusters] = useState({});
  const [clusterNames, setClusterNames] = useState([]);
  const [currentClusterIndex, setCurrentClusterIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Track if the current student already has a locker
  const [myLockerId, setMyLockerId] = useState(null);

  useEffect(() => {
    fetchLockers();
  }, [student]);

  const fetchLockers = async () => {
    try {
      setLoading(true);
      const res = await ApiService.getAllLockers();
      if (res.success) {
        processLockers(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch lockers", err);
    } finally {
      setLoading(false);
    }
  };

  const processLockers = (data) => {
    const groups = {};
    let foundMyLocker = null;

    data.forEach(locker => {
      // Check if this locker belongs to the logged-in student
      if (student && locker.student_id === student.student_id) {
        foundMyLocker = locker.locker_id;
      }

      // Group by name (e.g. Bunzel-1 -> Bunzel)
      const nameParts = locker.locker_number.split('-');
      const groupName = nameParts.length > 1 ? nameParts[0] : "Misc";
      
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(locker);
    });

    // Sort numerically within groups
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => 
        a.locker_number.localeCompare(b.locker_number, undefined, { numeric: true, sensitivity: 'base' })
      );
    });

    const names = Object.keys(groups).sort();
    setClusters(groups);
    setClusterNames(names);
    setMyLockerId(foundMyLocker);
  };

  const handleReserve = async (locker) => {
    if (!student) return alert("Student data missing. Please relogin.");
    if (myLockerId) return alert("You already have a locker reserved!");
    
    if (!window.confirm(`Confirm reservation for ${locker.locker_number}?`)) return;

    try {
      const res = await ApiService.reserveLocker(locker.locker_id, student.student_id);
      if (res.success) {
        alert("Locker reserved successfully!");
        fetchLockers(); // Refresh grid
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message || "Reservation failed");
    }
  };

  // Pagination Logic
  const currentClusterName = clusterNames[currentClusterIndex];
  const currentLockers = currentClusterName ? clusters[currentClusterName] : [];

  if (loading) return <div className="text-center text-gray-400 p-8">Loading lockers...</div>;
  if (clusterNames.length === 0) return <div className="text-center text-gray-400 p-8">No lockers available.</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Locker Availability</h2>
        
        {/* Pagination Controls */}
        <div className="flex items-center bg-gray-800 rounded-lg px-4 py-2 gap-4 shadow-lg border border-gray-700">
            <button 
                onClick={() => setCurrentClusterIndex(prev => Math.max(0, prev - 1))}
                disabled={currentClusterIndex === 0}
                className="text-blue-400 font-bold disabled:text-gray-600 hover:text-blue-300 transition"
            >
                &lt; Prev
            </button>
            <span className="font-semibold text-gray-200 min-w-[120px] text-center">
                {currentClusterName}
            </span>
            <button 
                onClick={() => setCurrentClusterIndex(prev => Math.min(clusterNames.length - 1, prev + 1))}
                disabled={currentClusterIndex === clusterNames.length - 1}
                className="text-blue-400 font-bold disabled:text-gray-600 hover:text-blue-300 transition"
            >
                Next &gt;
            </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {currentLockers.map((locker) => {
          const isOccupied = locker.status === 'occupied';
          const isMine = locker.locker_id === myLockerId;
          
          return (
            <button
              key={locker.locker_id}
              disabled={isOccupied} // Disable click if taken
              onClick={() => handleReserve(locker)}
              className={`
                relative p-4 rounded-xl h-32 flex flex-col justify-between items-center shadow-lg transition-all border-2
                ${isMine 
                  ? "bg-green-600/20 border-green-500 cursor-default" 
                  : isOccupied 
                    ? "bg-red-900/20 border-red-800/50 cursor-not-allowed opacity-80" 
                    : "bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-blue-500 cursor-pointer"
                }
              `}
            >
              <span className={`text-xl font-bold ${isOccupied ? "text-gray-500" : "text-gray-100"}`}>
                {locker.locker_number}
              </span>
              
              <div className="mt-2 w-full flex flex-col items-center">
                {isMine ? (
                  <span className="text-green-400 text-xs font-bold uppercase tracking-wider border border-green-500 px-2 py-1 rounded-full">
                    My Locker
                  </span>
                ) : isOccupied ? (
                  // CHANGED: Show "Taken By" + Name
                  <>
                    <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">
                      TAKEN BY
                    </span>
                    <span className="text-red-300 text-xs font-medium truncate w-full text-center px-2" title={locker.student_name}>
                      {locker.student_name || "Unknown"}
                    </span>
                  </>
                ) : (
                  <span className="text-blue-400 text-xs font-semibold">
                    Available
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StudentLockers;