import fs from 'fs';

async function test() {
  try {
    const formData = new FormData();
    const blob = new Blob([fs.readFileSync('test_input.pdf')]);
    formData.append('file', blob, 'test_input.pdf');
    formData.append('password', 'iqra');

    const res = await fetch('http://localhost:3000/api/tools/encrypt-pdf', {
      method: 'POST',
      body: formData,
      headers: {
        'Cookie': 'next-auth.session-token=123' // Dummy token to see if it bypasses or we get 401
      }
    });

    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}
test();
