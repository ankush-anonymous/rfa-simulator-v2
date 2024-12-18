import React, { memo, useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";

function CustomNode({ data }) {
  const [nodeData, setNodeData] = useState(data); // Track node data locally

  useEffect(() => {
    const flowData = JSON.parse(localStorage.getItem("flowData"));
    if (flowData && flowData.nodes) {
      const updatedNode = flowData.nodes.find((node) => node.id === data.id);
      if (updatedNode) {
        setNodeData(updatedNode); // Update node data from localStorage
      }
    }
  }, [data.id]); // Only run when data.id changes

  const config = nodeData.config || {}; // Fallback to an empty object if config is undefined
  const properties = config.properties || {}; // Fallback to an empty object if properties are undefined

  return (
    <div
      className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${
        data.isSelected ? "border-blue-500" : "border-stone-400"
      }`} // Apply blue border if selected
    >
      <div className="flex flex-col items-center">
        <div className="rounded-md w-16 h-16 flex justify-center items-center bg-gray-100">
          <img
            src={nodeData.image}
            alt={nodeData.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/64";
            }}
          />
        </div>
        <div className="mt-2 text-center">
          <div className="text-lg font-bold">{nodeData.name}</div>
          {/* Only display config details if they exist */}
          {config && (
            <>
              <div className="text-sm">{`Type: ${config.type}`}</div>
              {properties.power && (
                <div className="text-sm">{`Power: ${properties.power}`}</div>
              )}
              {properties.voltageRating && (
                <div className="text-sm">{`Voltage: ${properties.voltageRating}`}</div>
              )}
            </>
          )}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="h-16 !bg-teal-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="h-16 !bg-teal-500"
      />
    </div>
  );
}

export default memo(CustomNode);
