import { useLazyLoadQuery, useBlock } from "../@reactive-dot/react/src";
import { useState, useEffect } from "react";

const BlockData = () => {
  const [blockData, setBlockData] = useState([]);
  const block = useBlock("finalized");

  const events = useLazyLoadQuery((builder) =>
    builder.readStorage("System", "Events", [], {
      at: block.hash as `0x${string}`,
    })
  );

  useEffect(() => {
    //push block and events to blockData
    setBlockData((prev) => {
      return [
        ...prev,
        {
          block: block.number,
          events: events.length,
        },
      ];
    });
  }, [block]);

  return (
    <div>
      <ul>
        {blockData.map((data, index) => (
          <li key={index}>
            <p>Block: {data.block}</p>
            <p>Events: {data.events}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlockData;
