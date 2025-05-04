const PDFDocument = require("pdfkit");
const axios = require("axios");

async function downloadImage(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data, "binary");
}

function checkFull(doc, y, height) {
  if (y + height > doc.page.height) {
    doc.addPage();
    return 50; // Reset yPosition for the new page
  } else {
    return y + height; // Increment yPosition if it won't exceed the page height
  }
}

async function buildReceiptPDF(data, dataCallback, endCallback) {
  const doc = new PDFDocument();
  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  doc.font("Helvetica-Bold");
  doc.fontSize(40);
  doc.text("RECEIPT", 50, 40, { align: "left" });
  doc.font("Helvetica");
  if (!data.img)
    data.img = "https://storage.googleapis.com/test-bucket001/receipt.png";
  let imageBuffer = await downloadImage(data.img);
  doc.image(imageBuffer, 300, 40, { width: 50, height: 50, align: "right" });

  // Company details
  doc.font("Helvetica-Bold");
  doc.fontSize(16);
  doc.text(data.name, 300, 100, { align: "left" });
  doc.font("Helvetica");
  doc.fontSize(12);
  doc.text("Email: " + data.email, 300, 120, { align: "left" });
  doc.text("Phone: " + data.phone, 300, 140, { align: "left" });
  doc.text("Address: " + data.location, 300, 160, { align: "left" });

  //Buyer details
  doc.font("Helvetica-Bold");
  doc.text("Issue To:", 50, 200);
  doc.font("Helvetica");
  doc.text("Name: " + data.user.name, 50, 220);
  doc.text("Email: " + data.user.email, 50, 240);
  doc.text("Phone: " + data.user.phone, 50, 260);

  //Table
  doc.rect(50 - 3, 325, 250 - 2, 20).fill("black");
  doc.fillColor("white").text("Item Name", 50, 330);
  doc.rect(300 - 3, 325, 100 - 2, 20).fill("black");
  doc.fillColor("white").text("Price (Ksh)", 300, 330);
  doc.rect(400 - 3, 325, 50 - 2, 20).fill("black");
  doc.fillColor("white").text("Amount", 400, 330);
  doc.rect(450 - 3, 325, 100 - 2, 20).fill("black");
  doc.fillColor("white").text("Total (Ksh)", 450, 330);

  //table
  let rows = [];
  if (data.order.orders)
    rows = data.order.orders.map((o) => {
      return [o.name, o.price, o.amount, o.price * o.amount];
    });
  if (data.order.items)
    rows = data.order.items.map((o) => {
      return [o.name, o.price, o.amount, o.price * o.amount];
    });
  let colors = ["#EEEEEE", "#DDDDDD"];
  // Add rows to the table
  let yPosition = 350;
  let itemsTotal = 0;
  rows.forEach((row, idx) => {
    let color = colors[idx % 2];
    doc.rect(50 - 3, yPosition - 5, 250 - 2, 20).fill(color);
    doc
      .fillColor("black")
      .text(
        row[0].length > 50 ? row[0].slice(0, 46) + "..." : row[0],
        50,
        yPosition
      );
    doc.rect(300 - 3, yPosition - 5, 100 - 2, 20).fill(color);
    doc.fillColor("black").text(row[1], 300, yPosition);
    doc.rect(400 - 3, yPosition - 5, 50 - 2, 20).fill(color);
    doc.fillColor("black").text(row[2], 400, yPosition);
    doc.rect(450 - 3, yPosition - 5, 100 - 2, 20).fill(color);
    doc.fillColor("black").text(row[3], 450, yPosition);
    itemsTotal += row[3];
    // yPosition += 20;
    yPosition = checkFull(doc, yPosition, 20);
  });

  // yPosition = checkFull(doc, yPosition, 20);
  doc.text(
    "Delivery Fee: " + (data.order.total - itemsTotal) + " Ksh",
    50,
    yPosition
  );

  yPosition = checkFull(doc, yPosition, 40);
  doc.text("Total Amount: " + data.order.total + " Ksh", 50, yPosition);
  yPosition = checkFull(doc, yPosition, 20);
  doc.text("Date Paid: " + data.order.date, 50, yPosition);
  yPosition = checkFull(doc, yPosition, 20);
  doc.text("Mode of Payment: " + data.order.paymentMode, 50, yPosition);
  yPosition = checkFull(doc, yPosition, 20);
  yPosition = checkFull(doc, yPosition, 20);
  doc.font("Helvetica-Bold");
  doc.text("Delivery Address", 50, yPosition);
  doc.font("Helvetica");
  yPosition = checkFull(doc, yPosition, 20);
  doc.text(
    data.order.county +
      ", " +
      data.order.subcounty +
      " by " +
      data.order.courier
  );
  yPosition = checkFull(doc, yPosition, 20);
  doc.text(data.order.pickupDescription, 50, yPosition);

  // for (var i = 1; i < 20; i++) {
  //   yPosition = checkFull(doc, yPosition, 40);
  //   console.log(yPosition);
  //   doc.text(
  //     "To verify this document send it to the following email verify@go-duka.com",
  //     50,
  //     yPosition
  //   );
  // }
  // console.log(doc.bufferedPageRange());

  doc.end();
}

module.exports = { buildReceiptPDF };
