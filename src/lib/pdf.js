import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function embedQrCode(pdfDoc, page, qrCodeDataUrl) {
    if (qrCodeDataUrl) {
      // QR code data URL is like `data:image/png;base64,iVBORw0KGgo...`
      // We need to extract the base64 part
      const base64 = qrCodeDataUrl.split(',')[1];
      const qrImageBytes = Buffer.from(base64, 'base64');
      const qrImage = await pdfDoc.embedPng(qrImageBytes);

      const { width } = page.getSize();
      const yPosition = 100; // Fixed position for QR code at the bottom

      page.drawImage(qrImage, {
        x: width / 2 - 60, // Centered
        y: yPosition,
        width: 120,
        height: 120,
      });
    }
  }

export async function generateTicketPdf(ticket) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([300, 450]);
  const { height } = page.getSize();

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
  await embedQrCode(pdfDoc, page, ticket.qrCode);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export async function generatePassPdf(pass) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([300, 450]);
  const { height } = page.getSize();

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
  await embedQrCode(pdfDoc, page, pass.qrCode);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}