import { useState, useEffect } from "react";
import ApiService from "../services/ApiService";

const ManageLockers = () => {
  const [allLockers, setAllLockers] = useState([]); // Stores raw data
  const [clusters, setClusters] = useState({}); // Grouped data: { "Bunzel": [lockers...], "Safad": [lockers...] }
  const [clusterNames, setClusterNames] = useState([]); // ["Bunzel", "Safad"]
  const [currentClusterIndex, setCurrentClusterIndex] = useState(0); // Pagination index
  
  const [error, setError] = useState("");
  
  // State for renaming
  const [editingLockerId, setEditingLockerId] = useState(null);
  const [newName, setNewName] = useState("");

  // State for adding new locker cluster
  const [newLockerClusterName, setNewLockerClusterName] = useState("");

  useEffect(() => {
    fetchLockers();
  }, []);

  const fetchLockers = async () => {
    try {
      const res = await ApiService.getAllLockers();
      if (res.success) {
        processLockers(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch lockers", err);
      setError("Failed to load lockers.");
    }
  };

  // Group the flat list of lockers into clusters based on the name before the hyphen (e.g. Bunzel-1 -> Bunzel)
  const processLockers = (data) => {
    const groups = {};
    
    data.forEach(locker => {
      // Extract cluster name (e.g., "Bunzel" from "Bunzel-1")
      // If no hyphen, treat the whole name as the cluster or "Misc"
      const nameParts = locker.locker_number.split('-');
      const groupName = nameParts.length > 1 ? nameParts[0] : "Misc";
      
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(locker);
    });

    // Sort slots numerically within groups (Bunzel-1, Bunzel-2 ... Bunzel-25)
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => 
        a.locker_number.localeCompare(b.locker_number, undefined, { numeric: true, sensitivity: 'base' })
      );
    });

    const names = Object.keys(groups).sort();
    
    setAllLockers(data);
    setClusters(groups);
    setClusterNames(names);
    
    // Maintain page if valid, else go to 0
    if (currentClusterIndex >= names.length) {
        setCurrentClusterIndex(Math.max(0, names.length - 1));
    }
  };

  const handleAddCluster = async () => {
    if (!newLockerClusterName.trim()) return;
    if (clusterNames.includes(newLockerClusterName.trim())) {
        alert("Cluster already exists!");
        return;
    }

    try {
      const res = await ApiService.addLocker(newLockerClusterName);
      if (res.success) {
        await fetchLockers();
        setNewLockerClusterName("");
        // Switch to the newly created page (last one usually)
        setCurrentClusterIndex(clusterNames.length); 
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRenameStart = (locker) => {
    setEditingLockerId(locker.locker_id);
    setNewName(locker.locker_number);
  };

  const handleRenameSave = async (lockerId) => {
    if (!newName.trim()) return;
    try {
      const res = await ApiService.renameLocker(lockerId, newName);
      if (res.success) {
        fetchLockers();
        setEditingLockerId(null);
        setNewName("");
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCheckout = async (lockerId) => {
    if(!window.confirm("Checkout this locker?")) return;
    try {
      const res = await ApiService.adminCheckout(lockerId);
      if (res.success) fetchLockers();
      else alert(res.message);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (lockerId) => {
    if(!window.confirm("DELETE this locker slot?")) return;
    try {
      const res = await ApiService.deleteLocker(lockerId);
      if (res.success) fetchLockers();
    } catch (err) {
      alert(err.message);
    }
  };

  // Pagination Logic
  const currentClusterName = clusterNames[currentClusterIndex];
  const currentLockers = currentClusterName ? clusters[currentClusterName] : [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-200">Manage Lockers</h2>
        
        {/* Pagination Controls */}
        {clusterNames.length > 0 && (
            <div className="flex items-center bg-white rounded-lg shadow px-4 py-2 gap-4">
                <button 
                    onClick={() => setCurrentClusterIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentClusterIndex === 0}
                    className="text-blue-600 font-bold disabled:text-gray-300 hover:text-blue-800"
                >
                    &lt; Prev
                </button>
                <span className="font-semibold text-gray-700 min-w-[100px] text-center">
                    {currentClusterName} ({currentLockers.length} Slots)
                </span>
                <button 
                    onClick={() => setCurrentClusterIndex(prev => Math.min(clusterNames.length - 1, prev + 1))}
                    disabled={currentClusterIndex === clusterNames.length - 1}
                    className="text-blue-600 font-bold disabled:text-gray-300 hover:text-blue-800"
                >
                    Next &gt;
                </button>
            </div>
        )}
      </div>
      
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Grid Display (Strict 5x5) */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {currentLockers.map((locker) => (
          <div 
            key={locker.locker_id}
            className={`
              relative p-3 border-2 rounded-xl h-40 flex flex-col justify-between shadow-sm transition-all
              ${locker.status === 'occupied' 
                ? 'bg-red-50 border-red-500 shadow-red-100' 
                : 'bg-white border-gray-200 hover:border-blue-400'
              }
            `}
          >
            {/* Top Bar: Name & Delete */}
            <div className="flex justify-between items-start w-full">
              {/* Rename Logic */}
              {editingLockerId === locker.locker_id ? (
                <div className="flex items-center gap-1 w-full">
                    <input 
                        type="text" 
                        className="border border-gray-300 rounded px-1 py-0.5 w-full text-xs"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        autoFocus
                    />
                    <button onClick={() => handleRenameSave(locker.locker_id)} className="text-green-600">✓</button>
                    <button onClick={() => setEditingLockerId(null)} className="text-gray-500">✕</button>
                </div>
              ) : (
                <div className="flex items-center gap-1 overflow-hidden">
                    <span className="font-bold text-md text-gray-800 truncate" title={locker.locker_number}>
                        {locker.locker_number}
                    </span>
                    <button onClick={() => handleRenameStart(locker)} className="text-gray-300 hover:text-blue-600 text-[10px]">✎</button>
                </div>
              )}

              <button onClick={() => handleDelete(locker.locker_id)} className="text-gray-200 hover:text-red-600 text-xs font-bold ml-1">✕</button>
            </div>

            {/* Status & Action Area */}
            <div className="flex flex-col items-center justify-center flex-grow">
              {locker.status === 'occupied' ? (
                <>
                  <div className="text-center mb-2">
                    <span className="block text-[9px] text-red-500 font-bold uppercase">Occupied By</span>
                    <span className="font-semibold text-gray-900 text-xs truncate max-w-[100px] block">
                      {locker.student_name || "Unknown"}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleCheckout(locker.locker_id)}
                    className="w-full bg-red-500 text-white text-[10px] py-1.5 rounded hover:bg-red-600 transition-colors shadow-sm"
                  >
                    Checkout
                  </button>
                </>
              ) : (
                <span className="text-xs italic text-gray-400">Available</span>
              )}
            </div>
          </div>
        ))}
        
        {/* Fill empty slots if less than 25 to maintain grid structure */}
        {Array.from({ length: Math.max(0, 25 - currentLockers.length) }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-40 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50">
                <span className="text-gray-300 text-xs">Empty Slot</span>
            </div>
        ))}
      </div>

      {/* Add New Cluster Section (Separate from Grid) */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-100">
        <div>
            <h3 className="font-bold text-gray-700">Add New Locker Cluster</h3>
            <p className="text-sm text-gray-500">Creates a new 5x5 grid (25 slots)</p>
        </div>
        <div className="flex items-center gap-2">
            <input 
                type="text" 
                placeholder="Cluster Name (e.g. Bunzel)" 
                className="border border-gray-300 p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newLockerClusterName}
                onChange={(e) => setNewLockerClusterName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCluster()}
            />
            <button 
                onClick={handleAddCluster}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium shadow-sm whitespace-nowrap"
            >
                + Create Cluster
            </button>
        </div>
      </div>
    </div>
  );
};

export default ManageLockers;