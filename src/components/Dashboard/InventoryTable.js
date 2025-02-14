import React from "react";

const InventoryTable = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Category</th>
          <th>Stock</th>
          <th>Status</th>
          <th>Deadline</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.item}</td>
            <td>{item.category}</td>
            <td>{item.stock} {item.unit}</td>
            <td>{item.status || "N/A"}</td>
            <td>{item.deadline || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InventoryTable;