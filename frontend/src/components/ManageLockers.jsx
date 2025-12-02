import { useState, useEffect } from "react";
import ApiService from "../services/ApiService";

const ManageLockers = () => {
  const [lockers, setLockers] = useState([]);
  const [error, setError] = useState("");
  
  // State for renaming
  const [editingLockerId, setEditingLockerId] = useState(null);
  const [newName, setNewName] = useState("");

  // State for adding new locker
  const [newLockerName, setNewLockerName] = useState("");

  useEffect(() => {
    fetchLockers();
  }, []);

  const fetchLockers = async () => {
    try {
      const res = await ApiService.getAllLockers();
      if (res.success) setLockers(res.data);
    } catch (err) {
      console.error("Failed to fetch lockers", err);
    }
  };

  const handleAddLocker = async () => {
    if (!newLockerName.trim()) return;
    try {
      const res = await ApiService.addLocker(newLockerName);
      if (res.success) {
        fetchLockers();
        setNewLockerName("");
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
    if(!window.confirm("Confirm checkout for this locker?")) return;
    try {
      const res = await ApiService.adminCheckout(lockerId);
      if (res.success) fetchLockers();
      else alert(res.message);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (lockerId) => {
    if(!window.confirm("Are you sure you want to DELETE this locker?")) return;
    try {
      const res = await ApiService.deleteLocker(lockerId);
      if (res.success) fetchLockers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-200">Manage Lockers</h2>
      
      {/* Add Locker Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-8 flex justify-center items-center gap-4">
        <h3 className="font-semibold text-gray-700">Add New Locker:</h3>
        <input 
          type="text" 
          placeholder="Locker Name (e.g. F1)" 
          className="border p-2 rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newLockerName}
          onChange={(e) => setNewLockerName(e.target.value)}
        />
        <button 
          onClick={handleAddLocker}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
        >
          Add Locker
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* 5x5 Grid Display */}
      <div className="grid grid-cols-5 gap-4">
        {lockers.map((locker) => (
          <div 
            key={locker.locker_id}
            className={`
              relative p-4 border-2 rounded-xl h-40 flex flex-col justify-between shadow-sm transition-all
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
                <div className="flex items-center gap-1">
                    <input 
                        type="text" 
                        className="border border-gray-300 rounded px-1 py-0.5 w-16 text-sm"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        autoFocus
                    />
                    <button onClick={() => handleRenameSave(locker.locker_id)} className="text-green-600 text-xs font-bold">✓</button>
                    <button onClick={() => setEditingLockerId(null)} className="text-gray-500 text-xs">✕</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                    <span className="font-bold text-xl text-gray-800">{locker.locker_number}</span>
                    <button 
                        onClick={() => handleRenameStart(locker)}
                        className="text-gray-400 hover:text-blue-600 text-xs"
                        title="Rename"
                    >
                        ✎
                    </button>
                </div>
              )}

              <button 
                onClick={() => handleDelete(locker.locker_id)}
                className="text-gray-400 hover:text-red-600 font-bold"
                title="Delete Locker"
              >
                ✕
              </button>
            </div>

            {/* Status & Action Area */}
            <div className="mt-2 flex flex-col items-center justify-center flex-grow">
              {locker.status === 'occupied' ? (
                <>
                  <div className="text-center mb-2">
                    <span className="block text-xs text-red-500 font-semibold uppercase tracking-wide">Occupied By</span>
                    <span className="font-bold text-gray-800">{locker.student_name || "Unknown"}</span>
                  </div>
                  <button 
                    onClick={() => handleCheckout(locker.locker_id)}
                    className="w-full bg-red-500 text-white text-sm py-1.5 rounded hover:bg-red-600 transition-colors font-medium"
                  >
                    Checkout
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                   <span className="text-sm italic">Available</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageLockers;