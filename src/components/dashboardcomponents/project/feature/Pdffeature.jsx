import jsPDF from "jspdf";

const Pdffeature = ({ Categories, dimensions, calculateCost }) => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Bill Details", 10, 10);

    Categories.forEach((category, categoryIndex) => {
      doc.setFontSize(14);
      doc.text(`${category.name}`, 10, 20 + categoryIndex * 10);
      category.subworks.forEach((subwork, subworkIndex) => {
        const dims = dimensions[`${category.id}-${subwork.name}`];
        const estimatedCost = calculateCost(category.id, subwork).toFixed(2);
        doc.setFontSize(12);
        doc.text(
          `${subwork.name}: Length: ${dims?.length || 0} ft, Breadth: ${dims?.breadth || 0
          } ft, Depth: ${dims?.depth || 0} ft, Cost: ₹${estimatedCost}`,
          10,
          30 + (categoryIndex + subworkIndex) * 10
        );
      });
    });

    doc.save("BillDetails.pdf");
  };

  return (
    <button
      onClick={downloadPDF}
      className={`py-2 px-4 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white`}
    >
      Download Bill as PDF
    </button>
  );
};

export default Pdffeature;
