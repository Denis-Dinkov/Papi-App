import { config } from "../config";
import { useAccounts, useLazyLoadQuery, useBlock } from "@reactive-dot/react";

export default function MyComponent() {
  const accounts = useAccounts();
  const [timestamp, totalIssuance] = useLazyLoadQuery((builder) =>
    builder
      .readStorage("Timestamp", "Now", [])
      .readStorage("Balances", "TotalIssuance", []),
  );

  const block = useBlock('finalized');
  console.log(block)


  return (
    <div>
      <ul>
        {accounts.map((account, index) => (
          <li key={index}>
            <div>Address: {account.address}</div>
            {account.name && <div>Name: {account.name}</div>}
          </li>
        ))}
      </ul>
      <section>
        <div>
          Latest block timestamp: {new Date(Number(timestamp)).toLocaleString()}
        </div>
        <div>Total issuance: {totalIssuance.toString()}</div>
        {/* <div>Active: {activeEra}</div> */}
      </section>
    </div>
  );
}
