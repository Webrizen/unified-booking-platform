import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateTicketPdf(ticket) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([300, 400]);
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Title
  page.drawText('Water Park Ticket', {
    x: 50,
    y: height - 50,
    font: boldFont,
    size: 24,
    color: rgb(0, 0.53, 0.71),
  });

  // Details
  const details = [
    `Ticket ID: ${ticket._id.toString()}`,
    `Type: ${ticket.details.type}`,
    `Price: $${ticket.details.price}`,
    `Status: ${ticket.status}`,
    `Date: ${new Date(ticket.createdAt).toLocaleDateString()}`,
  ];

  let yPosition = height - 100;
  details.forEach(line => {
    page.drawText(line, { x: 50, y: yPosition, font, size: 12 });
    yPosition -= 20;
  });

  // QR Code
  if (ticket.qrCode) {
    const qrImage = await pdfDoc.embedPng(ticket.qrCode);
    page.drawImage(qrImage, {
      x: width / 2 - 50,
      y: yPosition - 110,
      width: 100,
      height: 100,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export async function generatePassPdf(pass) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([300, 400]);
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Title
  page.drawText('Marriage Garden Pass', {
    x: 50,
    y: height - 50,
    font: boldFont,
    size: 20,
    color: rgb(0.1, 0.5, 0.2),
  });

  // Details
  const details = [
    `Event: ${pass.details.eventName}`,
    `Guest: ${pass.details.guestName}`,
    `Access: ${pass.details.accessLevel}`,
    `Pass ID: ${pass._id.toString()}`,
    `Status: ${pass.status}`,
    `Date: ${new Date(pass.createdAt).toLocaleDateString()}`,
  ];

  let yPosition = height - 100;
  details.forEach(line => {
    page.drawText(line, { x: 50, y: yPosition, font, size: 12 });
    yPosition -= 20;
  });

  // QR Code
  if (pass.qrCode) {
    const qrImage = await pdfDoc.embedPng(pass.qrCode);
    page.drawImage(qrImage, {
      x: width / 2 - 50,
      y: yPosition - 110,
      width: 100,
      height: 100,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}