import React from "react";
import * as XLSX from "xlsx";

function ExcellFeature({ Categories, dimensions, calculateCost }) {
  const downloadExcel = () => {
    const data = [];
    let grandTotal = 0; // Variable to keep track of the grand total
  
    // Prepare data for the Excel sheet with units in values
    Categories.forEach((category) => {
      let categoryTotal = 0; // Variable to keep track of the category total
  
      category.subworks.forEach((subwork) => {
        const dims = dimensions[`${category.id}-${subwork.name}`] || {};
        const estimatedCost = calculateCost(category.id, subwork).toFixed(2);
  
        categoryTotal += parseFloat(estimatedCost); // Add to category total
        grandTotal += parseFloat(estimatedCost); // Add to grand total
  
        // Push data into the array with units
        data.push({
          Category: category.name,
          Subwork: subwork.name,
          "Length (ft)": dims.length ? `${dims.length} ft` : "0 ft",
          "Breadth (ft)": dims.breadth ? `${dims.breadth} ft` : "0 ft",
          "Depth (ft)": dims.depth ? `${dims.depth} ft` : "0 ft",
          "Cost per Unit (₹)": dims.totalvalue ? `₹${dims.totalvalue}` : "₹0",
          "Estimated Cost (₹)": `₹${estimatedCost}`,
        });
      });
  
      // Add a category total row
      data.push({
        Category: category.name,
        Subwork: "Total",
        "Length (ft)": "",
        "Breadth (ft)": "",
        "Depth (ft)": "",
        "Cost per Unit (₹)": "",
        "Estimated Cost (₹)": `₹${categoryTotal.toFixed(2)}`,
      });
    });
  
    // Add the grand total row
    data.push({
      Category: "Grand Total",
      Subwork: "",
      "Length (ft)": "",
      "Breadth (ft)": "",
      "Depth (ft)": "",
      "Cost per Unit (₹)": "",
      "Estimated Cost (₹)": `₹${grandTotal.toFixed(2)}`,
    });
  
    // Create and download Excel file
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bill Details");
    XLSX.writeFile(workbook, "BillDetails.xlsx");
  };
  

  return (
    <button
      onClick={downloadExcel}
      className="py-2 px-4 rounded-md bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
    >
      Download Bill as Excel
    </button>
  );
}

export default ExcellFeature;
