import fs from 'fs/promises';
import { PDFDocument } from 'pdf-lib';

async function generateTestPdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  page.drawText('This is a test PDF for hash turn tools!');
  const pdfBytes = await pdfDoc.save();
  await fs.writeFile('test.pdf', pdfBytes);
}

async function testEndpoints() {
  await generateTestPdf();
  const formData = new FormData();
  const fileData = await fs.readFile('test.pdf');
  formData.append('file', new Blob([fileData], { type: 'application/pdf' }), 'test.pdf');
  
  const endpoints = [
    'page-numbers',
    'repair-pdf',
    'pdf-to-markdown',
    'pdf-to-word',
    'pdf-to-excel',
    'pdf-to-powerpoint',
    'pdf-to-images'
  ];

  for (const endpoint of endpoints) {
    console.log(`\nTesting ${endpoint}...`);
    try {
      const res = await fetch(`http://localhost:3000/api/tools/${endpoint}`, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': 'Bearer e0679db13ffebc93213aa7b4edb269ced5de67a0aae2577995d7cd1506561401'
        }
      });
      console.log(`${endpoint} Status: ${res.status}`);
      if (!res.ok) {
        const text = await res.text();
        console.log(`Error Response:`, text);
      } else {
        console.log(`${endpoint} Success. Length: ${res.headers.get('content-length')} type: ${res.headers.get('content-type')}`);
      }
    } catch (err) {
      console.error(`${endpoint} Failed:`, err);
    }
  }
}

testEndpoints();
