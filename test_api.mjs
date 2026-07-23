import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function testApi() {
  // Create a dummy PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([500, 500]);
  page.drawText('Test Document', { x: 50, y: 400, size: 30 });
  const pdfBytes = await pdfDoc.save();
  
  fs.writeFileSync('test_dummy.pdf', pdfBytes);

  const formData = new FormData();
  formData.append('file', new Blob([pdfBytes], { type: 'application/pdf' }), 'test_dummy.pdf');

  try {
    const res = await fetch('http://localhost:3000/api/tools/pdf-to-text', {
      method: 'POST',
      body: formData,
    });
    
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Fetch Error:', err);
  }
}

testApi();
