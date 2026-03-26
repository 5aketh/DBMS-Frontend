import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const getPublicImageBuffer = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not load logo");
  return await response.arrayBuffer();
};

export const downloadStructuredExcel = async (
  data,
  columns,
  fileName = "Report"
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Report");

  // ✅ -------------------------------
  // MODE 2: PLAIN HEADER EXPORT
  // ✅ -------------------------------
  if (!data || data.length === 0) {
    worksheet.addRow(columns);

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${fileName}_Template.xlsx`);
    return;
  }

  // ✅ -------------------------------
  // MODE 1: FULL STYLED EXPORT
  // ✅ -------------------------------

  const lastColLetter = worksheet.getColumn(columns.length).letter;

  // Header layout
  worksheet.getRow(1).height = 40;
  worksheet.getRow(2).height = 40;

  worksheet.mergeCells("A1:A2");
  worksheet.mergeCells(`B1:${lastColLetter}2`);

  const logoCell = worksheet.getCell("A1");
  const titleCell = worksheet.getCell("B1");

  const headerBg = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF8F9FA" }
  };

  logoCell.fill = headerBg;
  titleCell.fill = headerBg;

  logoCell.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" }
  };

  titleCell.border = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  };

  // Logo
  try {
    const imageBuffer = await getPublicImageBuffer("/images/logo.png");
    const logoId = workbook.addImage({
      buffer: imageBuffer,
      extension: "png",
    });

    worksheet.addImage(logoId, {
      tl: { col: 0, row: 0 },
      ext: { width: 50, height: 50 }
    });
  } catch {
    console.warn("Logo not loaded");
  }

  // Title
  titleCell.value = "BMSCE PAPERS";
  titleCell.font = {
    bold: true,
    size: 22,
    color: { argb: "FF004B87" },
    name: "Calibri"
  };
  titleCell.alignment = { vertical: "middle", horizontal: "left" };

  // Meta row
  worksheet.mergeCells(`A3:${lastColLetter}3`);
  const metaCell = worksheet.getCell("A3");

  metaCell.value = `Report Type: ${fileName.toUpperCase()} | Generated: ${new Date().toLocaleString()}`;
  metaCell.font = { italic: true, size: 10, color: { argb: "FF666666" } };
  metaCell.border = {
    left: { style: "thin" },
    right: { style: "thin" },
    bottom: { style: "double" }
  };

  worksheet.addRow([]);

  // Table headers
  const headerRow = worksheet.addRow(columns);

  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF004B87" }
    };
    cell.alignment = { horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    };
  });

  // Data rows
  data.forEach((rowData, index) => {
    const row = worksheet.addRow(Object.values(rowData));

    row.eachCell(cell => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };

      if (index % 2 === 0) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF2F2F2" }
        };
      }
    });
  });

  // Footer
  worksheet.addRow([]);
  const footerRow = worksheet.lastRow.number + 1;

  worksheet.mergeCells(`A${footerRow}:${lastColLetter}${footerRow}`);
  const footerCell = worksheet.getCell(`A${footerRow}`);

  footerCell.value = "© 2026 BMSCE PAPERS.";
  footerCell.alignment = { horizontal: "center" };
  footerCell.font = { size: 9, italic: true };

  // Auto width
  worksheet.columns.forEach(column => {
    let max = 10;
    column.eachCell({ includeEmpty: true }, cell => {
      const val = cell.value ? cell.value.toString() : "";
      max = Math.max(max, val.length);
    });
    column.width = Math.min(max + 2, 30);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}_Report.xlsx`);
};