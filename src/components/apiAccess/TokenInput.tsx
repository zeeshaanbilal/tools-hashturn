import React from "react";

export default function TokenInput() {
    return (
      <div className="mb-6">
        <label className="text-sm text-gray-600">Authorization Token</label>
        <input
          type="text"
          value="token"
          readOnly
          placeholder="Paste your API token..."
          className="w-full border p-2 rounded mt-1"
        />
      </div>
    );
  }
  