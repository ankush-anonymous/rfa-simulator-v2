import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";

function CustomNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      {/* Image in a square box with title below */}
      <div className="flex flex-col items-center">
        <div
          className="rounded-md w-16 h-16 flex justify-center items-center bg-gray-100"
          style={{ width: "64px", height: "64px" }} // Adjust width and height
        >
          <img
            src={data.image} // Use data.image to dynamically load the image
            alt={data.name}
            style={{
              width: "100%", // Ensure the image takes full width
              height: "100%", // Ensure the image takes full height
              objectFit: "cover",
              borderRadius: "8px",
            }}
            onError={(e) => {
              // Handle image load error (in case of missing URL or broken link)
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/64"; // Fallback image
            }}
          />
        </div>
        <div className="mt-2 text-center">
          <div className="text-lg font-bold">{data.name}</div>
        </div>
      </div>

      {/* Place handle on the left side */}
      <Handle
        type="target"
        position={Position.Left} // Position on the left
        className="h-16 !bg-teal-500"
      />
      {/* Place handle on the right side */}
      <Handle
        type="source"
        position={Position.Right} // Position on the right
        className="h-16 !bg-teal-500"
      />
    </div>
  );
}

export default memo(CustomNode);
