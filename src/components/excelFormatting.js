import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const getPublicImageBuffer = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not load logo");
  return await response.arrayBuffer();
};

export const downloadStructuredExcel = async (data, columns, fileName = "Report") => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Report");

  // --- 1. SET HEADER ROW HEIGHT ---
  worksheet.getRow(1).height = 40;
  worksheet.getRow(2).height = 40;

  // --- 2. UNIFY LOGO AND TEXT AREA (Removing Borders) ---
  
  // Merge A1 and A2 vertically so there is no line between them
  worksheet.mergeCells("A1:A2");
  
  // Merge B1 through H2 for the Title
  worksheet.mergeCells("B1:H2");

  const logoCell = worksheet.getCell("A1");
  const titleCell = worksheet.getCell("B1");

  // Apply a shared background color to make them look like one unit
  const headerBg = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF8F9FA" } // Very light grey/white
  };
  logoCell.fill = headerBg;
  titleCell.fill = headerBg;

  // REMOVE BORDERS between A and B
  // We only set the outside borders of the whole header block
  logoCell.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" }
    // Note: No right border here
  };

  titleCell.border = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
    // Note: No left border here, so A and B look connected
  };

  // --- 3. ADD LOGO IMAGE ---
  try {
    const imageBuffer = await getPublicImageBuffer("/images/logo.png");
    const logoId = workbook.addImage({
      buffer: imageBuffer,
      extension: "png",
    });

    worksheet.addImage(logoId, {
      tl: { col: 0.1, row: 0.2 }, 
      ext: { width: 60, height: 60 } 
    });
  } catch (error) {
    console.error("Logo Error:", error);
  }

  // --- 4. STYLE TITLE TEXT ---
  titleCell.value = "BMSCE PAPERS";
  titleCell.alignment = { vertical: "middle", horizontal: "left", indent: 0 };
  titleCell.font = { bold: true, size: 22, color: { argb: "FF004B87" }, name: "Tomorrow, sans-serif" };

  // --- 5. SUBHEADER / METADATA ---
  worksheet.mergeCells("A3:H3");
  const metaCell = worksheet.getCell("A3");
  metaCell.value = `Report Type: ${fileName.toUpperCase()} | Generated: ${new Date().toLocaleString()}`;
  metaCell.font = { italic: true, size: 10, color: { argb: "FF666666" } };
//   metaCell.alignment = { horizontal: "center" };
  metaCell.border = {
    left: { style: "thin" },
    right: { style: "thin" },
    bottom: { style: "double" } // Professional double line divider
  };

  worksheet.addRow([]); // Spacer

  // --- 6. TABLE HEADERS ---
  const displayHeaders = columns.map(col => col.toUpperCase().replaceAll("_", " "));
  const headerRow = worksheet.addRow(displayHeaders);

  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF004B87" } };
    cell.alignment = { horizontal: "center" };
    cell.border = {
      top: { style: "thin" }, left: { style: "thin" },
      bottom: { style: "thin" }, right: { style: "thin" }
    };
  });

  // --- 7. DATA ROWS ---
  data.forEach((item) => {
    const rowValues = columns.map((col) => {
      const val = item[col];
      return (typeof val === "object" && val !== null) ? JSON.stringify(val) : (val ?? "—");
    });

    const row = worksheet.addRow(rowValues);
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" }, left: { style: "thin" },
        bottom: { style: "thin" }, right: { style: "thin" }
      };
    });
  });

  // --- 8. FOOTER ---
  worksheet.addRow([]); 
  const footerRowNumber = worksheet.lastRow.number + 1;
  worksheet.mergeCells(`A${footerRowNumber}:H${footerRowNumber}`);
  const footerCell = worksheet.getCell(`A${footerRowNumber}`);
  footerCell.value = "© 2026 BMSCE PAPERS.";
  footerCell.font = { size: 9, italic: true };
  footerCell.alignment = { horizontal: "center" };

  // Column Widths
  worksheet.columns.forEach((column, i) => {
    column.width = i === 0 ? 12 : 25; 
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}_Report.xlsx`);
};