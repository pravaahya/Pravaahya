import PDFDocument from 'pdfkit';
import { IOrder } from '../models/order.model';

export const generateInvoicePDF = (order: IOrder): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Brand Header Mapping
      try {
         doc.image('public/logo.png', 50, 45, { width: 100 });
      } catch (err) {
         console.warn("[PDF Mapping] Custom logo injection dropped: image not discovered on internal bounds. Falling back.");
      }
      doc.fontSize(24).font('Helvetica-Bold').fillColor('#166534').text('Pravaahya', { align: 'right' });
      doc.moveDown(2);
      
      // Invoice Heading
      doc.fontSize(20).font('Helvetica-Bold').fillColor('#111827').text('TAX INVOICE', { align: 'left', characterSpacing: 2 });
      
      // Exact Order Identification Block
      doc.fontSize(12).moveDown();
      doc.font('Helvetica-Bold').fillColor('#374151').text('Order ID:', { continued: true }).font('Helvetica').text(` ${order._id}`);
      doc.font('Helvetica-Bold').text('Date:', { continued: true }).font('Helvetica').text(` ${new Date((order as any).createdAt).toLocaleDateString()}`);
      doc.font('Helvetica-Bold').text('Payment Reference:', { continued: true }).font('Helvetica').text(` ${order.paymentId}`);
      doc.moveDown(1.5);

      // Addressee Structurally
      doc.font('Helvetica-Bold').text('Billed To:');
      doc.font('Helvetica').text(order.user.name || 'Valued Customer');
      if (order.user.email) doc.text(order.user.email);
      if (order.user.phone) doc.text(order.user.phone);
      if (order.user.address) {
         doc.text(`${order.user.address.house}, ${order.user.address.street}`);
         doc.text(`${order.user.address.landmark ? order.user.address.landmark + ', ' : ''}${order.user.address.cityVillage}`);
         doc.text(`${order.user.address.district}, ${order.user.address.state} - ${order.user.address.pincode}`);
         doc.text(order.user.address.country);
      }
      doc.moveDown(2);

      // Ledger Table Start
      const tableTop = doc.y;
      doc.font('Helvetica-Bold').fillColor('#111827');
      doc.text('Item / Product Name', 50, tableTop);
      doc.text('Qty', 350, tableTop, { align: 'center' });
      doc.text('Price', 420, tableTop, { align: 'right' });
      doc.text('Total', 500, tableTop, { align: 'right' });
      
      doc.moveTo(50, doc.y + 10).lineTo(545, doc.y + 10).strokeColor('#e5e7eb').stroke();
      doc.moveDown(2);

      // Ledger Iteration
      let yPosition = doc.y;
      doc.font('Helvetica').fillColor('#374151');
      order.products.forEach(item => {
        // Prevent layout collision effectively per item row mapped uniquely
        if (yPosition > 700) {
           doc.addPage();
           yPosition = 50;
        }
        doc.text(item.name, 50, yPosition, { width: 280 });
        doc.text(item.quantity.toString(), 350, yPosition, { align: 'center', width: 25 });
        doc.text(`Rs. ${item.price.toFixed(2)}`, 420, yPosition, { align: 'right', width: 40 });
        doc.text(`Rs. ${(item.price * item.quantity).toFixed(2)}`, 500, yPosition, { align: 'right', width: 45 });
        yPosition += Math.max(20, doc.heightOfString(item.name, { width: 280 }) + 5);
      });

      // Aggregate Terminal Summary
      doc.moveTo(350, yPosition + 10).lineTo(545, yPosition + 10).strokeColor('#9ca3af').stroke();
      doc.font('Helvetica-Bold').fillColor('#111827');
      doc.text('Total Paid Amount:', 350, yPosition + 25);
      doc.text(`Rs. ${order.total.toFixed(2)}`, 500, yPosition + 25, { align: 'right', width: 45 });

      // Stylized Footer
      doc.fontSize(10).font('Helvetica-Oblique').fillColor('#6b7280')
         .text('Thank you for shopping sustainably with Pravaahya!', 50, 780, { align: 'center', width: 495 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
