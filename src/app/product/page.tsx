"use client";
import React, { useState } from "react";
import MultiSelect from "../components/MultiSelect";

const initialFilter = {
  warehouse_id: [],
};
function page() {
  const innitialproduct = [
    { label: "Apple", value: "1" },
    { label: "Orange", value: "2" },
    { label: "Banana", value: "3" },
    { label: "Grapes", value: "4" },
    { label: "Mango", value: "5" },
  ];

  const [filteredData, setFilteredData] = useState<{
    warehouse_id: string[];
  }>(initialFilter);

  console.log(filteredData);
  const onChangeFilter = (name: string, value: string) => {
    setFilteredData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div>
      {" "}
      <div>
        {innitialproduct && (
          <MultiSelect
            className=""
            error=""
            label="Warehouse"
            options={innitialproduct}
            value={innitialproduct?.filter((warehouse) =>
              filteredData.warehouse_id?.includes(warehouse.value.toString())
            )}
            onChange={(selectedOptions: any) => {
              const selectedValues = selectedOptions.map(
                (option: any) => option.value
              );
              onChangeFilter("warehouse_id", selectedValues);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default page;
