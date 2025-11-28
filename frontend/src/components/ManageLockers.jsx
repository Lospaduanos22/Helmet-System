import React, { Component } from "react";

class ManageLockers extends Component {
  state = {
    currentPage: 0,
    lockers: [
      { name: "Main Locker", slots: Array(25).fill(null) },
      { name: "Backup Locker", slots: Array(25).fill(null) },
      // more lockers
    ],
  };

  handleNext = () => {
    const totalPages = this.state.lockers.length;
    this.setState({ currentPage: (this.state.currentPage + 1) % totalPages });
  };

  handlePrev = () => {
    const totalPages = this.state.lockers.length;
    this.setState({
      currentPage: (this.state.currentPage - 1 + totalPages) % totalPages,
    });
  };

  handleCheckout = (slotIndex) => {
    const lockers = [...this.state.lockers];
    const slot = lockers[this.state.currentPage].slots[slotIndex];
    if (!slot?.taken) {
      lockers[this.state.currentPage].slots[slotIndex] = { taken: true };
      this.setState({ lockers });
    }
  };

  handleRenameLocker = () => {
    const newName = prompt("Enter new locker name:");
    if (newName) {
      const lockers = [...this.state.lockers];
      lockers[this.state.currentPage].name = newName;
      this.setState({ lockers });
    }
  };

  render() {
    const locker = this.state.lockers[this.state.currentPage];
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <h2 className="text-2xl font-bold mb-4 text-white">{locker.name}</h2>
        <div className="grid grid-cols-5 gap-2"> {/* reduced gap */}
          {locker.slots.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => this.handleCheckout(idx)}
              className={`w-full p-3 rounded-lg font-semibold text-sm transition shadow-lg text-center ${
                slot?.taken
                  ? "bg-red-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {locker.name}-{idx + 1} <br /> 
              <span className="text-xs">{slot?.taken ? "Checked Out" : "Available"}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={this.handlePrev}
            className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm"
          >
            Previous Locker
          </button>
          <button
            onClick={this.handleRenameLocker}
            className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm"
          >
            Rename Locker
          </button>
          <button
            onClick={this.handleNext}
            className="py-2 px-4 bg-indigo-500 hover:bg-indigo-400 rounded-lg text-white text-sm"
          >
            Next Locker
          </button>
        </div>
      </div>
    );
  }
}

export default ManageLockers;
