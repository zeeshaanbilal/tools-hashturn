export const tools = [
    {
        id:1,
      name: "Watermark PDF",
      slug: "watermark-pdf",
      description: "Apply a watermark text to every page of a PDF.",
      method: "POST",
      endpoint: "/api/tools/watermark-pdf",
      headers: {
        Authorization: "Bearer {token}",
        "Content-Type": "multipart/form-data",
      },
      sampleRequest: {
        curl: `
  curl -X POST \\
    -H "Authorization: Bearer {token}" \\
    -F "file=@document.pdf" \\
    -F "text=CONFIDENTIAL" \\
    https://api.hashturn.com/api/tools/watermark-pdf
  `,
        js: `
  const form = new FormData();
  form.append("file", file);
  form.append("text", "CONFIDENTIAL");
  
  fetch("https://api.hashturn.com/api/tools/watermark-pdf", {
    method: "POST",
    headers: { Authorization: "Bearer {token}" },
    body: form
  }).then(res => res.blob());
  `,
        python: `
  import requests
  
  files = {"file": open("document.pdf", "rb")}
  data = {"text": "CONFIDENTIAL"}
  
  r = requests.post(
    "https://api.hashturn.com/api/tools/watermark-pdf",
    headers={"Authorization": "Bearer {token}"},
    files=files,
    data=data
  )
  open("output.pdf", "wb").write(r.content)
  `,
      },
      sampleResponse: {
        200: "<binary PDF>",
        400: { error: "Missing file" },
        500: { error: "Failed to add watermark" },
      },
    },
  
    {
        id:2,
      name: "Typed To PDF",
      slug: "typed-to-pdf",
      description: "Convert typed text into a formatted PDF.",
      method: "POST",
      endpoint: "/api/tools/typed-to-pdf",
      headers: {
        Authorization: "Bearer {token}",
        "Content-Type": "application/json",
      },
      sampleRequest: {
        curl: `
  curl -X POST \\
    -H "Authorization: Bearer {token}" \\
    -H "Content-Type: application/json" \\
    -d '{"type":"text","content":"Hello world","filename":"document"}' \\
    https://api.hashturn.com/api/tools/typed-to-pdf
  `,
        js: `
  fetch("https://api.hashturn.com/api/tools/typed-to-pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer {token}",
    },
    body: JSON.stringify({ type: "text", content: "Hello world", filename: "document" }),
  }).then(res => res.blob());
  `,
        python: `
  import requests
  
  payload = {"type": "text", "content": "Hello world", "filename": "document"}
  
  r = requests.post(
    "https://api.hashturn.com/api/tools/typed-to-pdf",
    headers={
      "Authorization": "Bearer {token}",
      "Content-Type": "application/json"
    },
    json=payload
  )
  open("output.pdf", "wb").write(r.content)
  `,
      },
      sampleResponse: {
        200: "<binary PDF>",
        400: { error: "Missing 'type' or 'content' in request body" },
        500: { error: "Internal server error message" },
      },
    },
  
    {
        id:3,
      name: "Text To PDF",
      slug: "text-to-pdf",
      description: "Convert plain text files into structured PDF documents.",
      method: "POST",
      endpoint: "/api/tools/text-to-pdf",
      headers: {
        Authorization: "Bearer {token}",
        "Content-Type": "multipart/form-data",
      },
      sampleRequest: {
        curl: `
  curl -X POST \\
    -H "Authorization: Bearer {token}" \\
    -F "file=@notes.txt" \\
    https://api.hashturn.com/api/tools/text-to-pdf
  `,
        js: `
  const form = new FormData();
  form.append("file", textFile);
  
  fetch("https://api.hashturn.com/api/tools/text-to-pdf", {
    method: "POST",
    headers: { Authorization: "Bearer {token}" },
    body: form
  }).then(res => res.blob());
  `,
        python: `
  import requests
  
  files = {"file": open("notes.txt", "rb")}
  
  r = requests.post(
    "https://api.hashturn.com/api/tools/text-to-pdf",
    headers={"Authorization": "Bearer {token}"},
    files=files
  )
  open("output.pdf", "wb").write(r.content)
  `,
      },
      sampleResponse: {
        200: "<binary PDF>",
        400: { error: "Only .txt files are supported" },
        500: { error: "Internal server error message" },
      },
    },
  
    {
        id:4,
      name: "Split PDF",
      slug: "split-pdf",
      description: "Split a PDF into multiple smaller PDFs.",
      method: "POST",
      endpoint: "/api/tools/split-pdf",
      headers: {
        Authorization: "Bearer {token}",
        "Content-Type": "multipart/form-data",
      },
      sampleRequest: {
        curl: `
  curl -X POST \\
    -H "Authorization: Bearer {token}" \\
    -F "file=@document.pdf" \\
    -F "pages=1,2,3-5" \\
    https://api.hashturn.com/api/tools/split-pdf
  `,
        js: `
  const form = new FormData();
  form.append("file", pdfFile);
  form.append("pages", "1,2,3-5");
  
  fetch("https://api.hashturn.com/api/tools/split-pdf", {
    method: "POST",
    headers: { Authorization: "Bearer {token}" },
    body: form
  }).then(res => res.json());
  `,
        python: `
  import requests
  
  files = {"file": open("document.pdf", "rb")}
  data = {"pages": "1,2,3-5"}
  
  r = requests.post(
    "https://api.hashturn.com/api/tools/split-pdf",
    headers={"Authorization": "Bearer {token}"},
    files=files
  )
  
  print(r.json())
  `,
      },
      sampleResponse: {
        200: "<binary PDF with selected pages>",
        400: { error: "Missing file or pages" },
        500: { error: "Failed to split PDF" },
      },
    },
  
    {
        id:5,
      name: "Reorder Rotate PDF",
      slug: "reorder-rotate-pdf",
      description: "Rearrange or rotate PDF pages.",
      method: "POST",
      endpoint: "/api/tools/reorder-rotate-pdf",
      headers: {
        Authorization: "Bearer {token}",
        "Content-Type": "multipart/form-data",
      },
      sampleRequest: {
        curl: `
  curl -X POST \\
    -H "Authorization: Bearer {token}" \\
    -F "file=@document.pdf" \\
    -F "order=2,1,3" \\
    -F "rotations=0,90,180" \\
    https://api.hashturn.com/api/tools/reorder-rotate-pdf
  `,
        js: `
  const form = new FormData();
  form.append("file", pdfFile);
  form.append("order", "2,1,3");
  form.append("rotations", "0,90,180");
  
  fetch("https://api.hashturn.com/api/tools/reorder-rotate-pdf", {
    method: "POST",
    headers: { Authorization: "Bearer {token}" },
    body: form
  }).then(res => res.blob());
  `,
        python: `
  import requests
  
  files = {"file": open("document.pdf", "rb")}
  data = {"order": "2,1,3", "rotations": "0,90,180"}
  
  r = requests.post(
    "https://api.hashturn.com/api/tools/reorder-rotate-pdf",
    headers={"Authorization": "Bearer {token}"},
    files=files,
    data=data
  )
  
  open("output.pdf", "wb").write(r.content)
  `,
      },
      sampleResponse: {
        200: "<binary PDF>",
        400: { error: "Missing file or order" },
        500: { error: "Failed to reorder/rotate PDF" },
      },
    },
  
    {
        id:6,
      name: "PDF To Text",
      slug: "pdf-to-text",
      description: "Extract readable text from PDF files.",
      method: "POST",
      endpoint: "/api/tools/pdf-to-text",
      headers: {
        Authorization: "Bearer {token}",
        "Content-Type": "multipart/form-data",
      },
      sampleRequest: {
        curl: `
  curl -X POST \\
    -H "Authorization: Bearer {token}" \\
    -F "file=@document.pdf" \\
    https://api.hashturn.com/api/tools/pdf-to-text
  `,
        js: `
  const form = new FormData();
  form.append("file", pdfFile);
  
  fetch("https://api.hashturn.com/api/tools/pdf-to-text", {
    method: "POST",
    headers: { Authorization: "Bearer {token}" },
    body: form
  }).then(res => res.json());
  `,
        python: `
  import requests
  
  files = {"file": open("document.pdf", "rb")}
  
  r = requests.post(
    "https://api.hashturn.com/api/tools/pdf-to-text",
    headers={"Authorization": "Bearer {token}"},
    files=files
  )
  
  print(r.json())
  `,
      },
      sampleResponse: {
        200: { numPages: 3, text: "Page 1: ... Page 2: ..." },
        400: { error: "Only .pdf files are supported" },
        500: { error: "Internal server error message" },
      },
    },
  
    {
        id:7,
      name: "PDF To Images",
      slug: "pdf-to-images",
      description: "Convert PDF pages into images.",
      method: "POST",
      endpoint: "/api/tools/pdf-to-images",
      headers: {
        Authorization: "Bearer {token}",
        "Content-Type": "multipart/form-data",
      },
      sampleRequest: {
        curl: `
  curl -X POST \\
    -H "Authorization: Bearer {token}" \\
    -F "file=@document.pdf" \\
    https://api.hashturn.com/api/tools/pdf-to-images
  `,
        js: `
  const form = new FormData();
  form.append("file", pdfFile);
  
  fetch("https://api.hashturn.com/api/tools/pdf-to-images", {
    method: "POST",
    headers: { Authorization: "Bearer {token}" },
    body: form
  }).then(res => res.json());
  `,
        python: `
  import requests
  
  files = {"file": open("document.pdf", "rb")}
  
  r = requests.post(
    "https://api.hashturn.com/api/tools/pdf-to-images",
    headers={"Authorization": "Bearer {token}"},
    files=files
  )
  
  print(r.json())
  `,
      },
      sampleResponse: {
        200: "<zip with PNG images>",
        400: { error: "Only .pdf files are supported" },
        500: { error: "Internal server error message" },
      },
    },
  
    {
        id:8,
      name: "Merge PDFs",
      slug: "merge-pdfs",
      description: "Combine multiple PDFs into a single file.",
      method: "POST",
      endpoint: "/api/tools/merge-pdfs",
      headers: {
        Authorization: "Bearer {token}",
        "Content-Type": "multipart/form-data",
      },
      sampleRequest: {
        curl: `
  curl -X POST \\
    -H "Authorization: Bearer {token}" \\
    -F "files=@file1.pdf" \\
    -F "files=@file2.pdf" \\
    https://api.hashturn.com/api/tools/merge-pdfs
  `,
        js: `
  const form = new FormData();
  form.append("files", file1);
  form.append("files", file2);
  
  fetch("https://api.hashturn.com/api/tools/merge-pdfs", {
    method: "POST",
    headers: { Authorization: "Bearer {token}" },
    body: form
  }).then(res => res.blob());
  `,
        python: `
  import requests
  
  files = [
    ("files", open("file1.pdf", "rb")),
    ("files", open("file2.pdf", "rb"))
  ]
  
  r = requests.post(
    "https://api.hashturn.com/api/tools/merge-pdfs",
    headers={"Authorization": "Bearer {token}"},
    files=files
  )
  
  open("merged.pdf", "wb").write(r.content)
  `,
      },
      sampleResponse: {
        200: "<binary PDF>",
        400: { error: "No files provided" },
        500: { error: "Failed to merge PDFs" },
      },
    },
  
    {
        id:9,
      name: "Markdown To PDF",
      slug: "markdown-to-pdf",
      description: "Transform Markdown content into styled PDF.",
      method: "POST",
      endpoint: "/api/tools/markdown-to-pdf",
      headers: {
        Authorization: "Bearer {token}",
        "Content-Type": "multipart/form-data",
      },
      sampleRequest: {
        curl: `
  curl -X POST \\
    -H "Authorization: Bearer {token}" \\
    -F "file=@document.md" \\
    https://api.hashturn.com/api/tools/markdown-to-pdf
  `,
        js: `
  const form = new FormData();
  form.append("file", markdownFile);
  
  fetch("https://api.hashturn.com/api/tools/markdown-to-pdf", {
    method: "POST",
    headers: { Authorization: "Bearer {token}" },
    body: form
  }).then(res => res.blob());
  `,
        python: `
  import requests
  
  files = {"file": open("document.md", "rb")}
  
  r = requests.post(
    "https://api.hashturn.com/api/tools/markdown-to-pdf",
    headers={"Authorization": "Bearer {token}"},
    files=files
  )
  
  open("output.pdf", "wb").write(r.content)
  `,
      },
      sampleResponse: {
        200: "<binary PDF>",
        400: { error: "Only .md (Markdown) files are supported" },
        500: { error: "Internal server error message" },
      },
    },
  
    {
        id:10,
      name: "Images To PDF",
      slug: "images-to-pdf",
      description: "Combine multiple images into one PDF.",
      method: "POST",
      endpoint: "/api/tools/images-to-pdf",
      headers: {
        Authorization: "Bearer {token}",
        "Content-Type": "multipart/form-data",
      },
      sampleRequest: {
        curl: `
  curl -X POST \\
    -H "Authorization: Bearer {token}" \\
    -F "files=@image1.jpg" \\
    -F "files=@image2.jpg" \\
    https://api.hashturn.com/api/tools/images-to-pdf
  `,
        js: `
  const form = new FormData();
  form.append("files", image1);
  form.append("files", image2);
  
  fetch("https://api.hashturn.com/api/tools/images-to-pdf", {
    method: "POST",
    headers: { Authorization: "Bearer {token}" },
    body: form
  }).then(res => res.blob());
  `,
        python: `
  import requests
  
  files = [
    ("files", open("image1.jpg", "rb")),
    ("files", open("image2.jpg", "rb"))
  ]
  
  r = requests.post(
    "https://api.hashturn.com/api/tools/images-to-pdf",
    headers={"Authorization": "Bearer {token}"},
    files=files
  )
  
  open("output.pdf", "wb").write(r.content)
  `,
      },
      sampleResponse: {
        200: "<binary PDF>",
        400: { error: "No image files provided (png, jpg, jpeg, webp)" },
        500: { error: "Internal server error message" },
      },
    },
  
    {
        id:11,
      name: "HTML To PDF",
      slug: "html-to-pdf",
      description: "Render HTML into a clean PDF.",
      method: "POST",
      endpoint: "/api/tools/html-to-pdf",
      headers: {
        Authorization: "Bearer {token}",
        "Content-Type": "multipart/form-data",
      },
      sampleRequest: {
        curl: `
  curl -X POST \\
    -H "Authorization: Bearer {token}" \\
    -F "file=@document.html" \\
    https://api.hashturn.com/api/tools/html-to-pdf
  `,
        js: `
  const form = new FormData();
  form.append("file", htmlFile);
  
  fetch("https://api.hashturn.com/api/tools/html-to-pdf", {
    method: "POST",
    headers: { Authorization: "Bearer {token}" },
    body: form
  }).then(res => res.blob());
  `,
        python: `
  import requests
  
  files = {"file": open("document.html", "rb")}
  
  r = requests.post(
    "https://api.hashturn.com/api/tools/html-to-pdf",
    headers={"Authorization": "Bearer {token}"},
    files=files
  )
  
  open("output.pdf", "wb").write(r.content)
  `,
      },
      sampleResponse: {
        200: "<binary PDF>",
        400: { error: "Only .html or .htm files are supported" },
        500: { error: "Internal server error message" },
      },
    },
  
    {
        id:12,
      name: "Encrypt PDF",
      slug: "encrypt-pdf",
      description: "Password protect a PDF.",
      method: "POST",
      endpoint: "/api/tools/encrypt-pdf",
      headers: {
        Authorization: "Bearer {token}",
        "Content-Type": "multipart/form-data",
      },
      sampleRequest: {
        curl: `
  curl -X POST \\
    -H "Authorization: Bearer {token}" \\
    -F "file=@document.pdf" \\
    -F "password=1234" \\
    https://api.hashturn.com/api/tools/encrypt-pdf
  `,
        js: `
  const form = new FormData();
  form.append("file", pdfFile);
  form.append("password", "1234");
  
  fetch("https://api.hashturn.com/api/tools/encrypt-pdf", {
    method: "POST",
    headers: { Authorization: "Bearer {token}" },
    body: form
  }).then(res => res.blob());
  `,
        python: `
  import requests
  
  files = {"file": open("document.pdf", "rb")}
  data = {"password": "1234"}
  
  r = requests.post(
    "https://api.hashturn.com/api/tools/encrypt-pdf",
    headers={"Authorization": "Bearer {token}"},
    files=files,
    data=data
  )
  
  open("output.pdf", "wb").write(r.content)
  `,
      },
      sampleResponse: {
        200: "<binary PDF>",
        400: { error: "Missing file or password" },
        500: { error: "Failed to encrypt PDF: <details>" },
      },
    },
  
    //
    // OTHER CATEGORY
    //
  
    {
        id:13,
      name: "Text To HTML",
      slug: "text-to-html",
      description: "Convert plain text into structured HTML.",
      method: "POST",
      endpoint: "/api/tools/text-to-html",
      headers: {
        Authorization: "Bearer {token}",
        "Content-Type": "multipart/form-data",
      },
      sampleRequest: {
        curl: `
  curl -X POST \\
    -H "Authorization: Bearer {token}" \\
    -F "file=@notes.txt" \\
    https://api.hashturn.com/api/tools/text-to-html
  `,
        js: `
  const form = new FormData();
  form.append("file", textFile);
  
  fetch("https://api.hashturn.com/api/tools/text-to-html", {
    method: "POST",
    headers: { Authorization: "Bearer {token}" },
    body: form
  }).then(res => res.text());
  `,
        python: `
  import requests
  
  files = {"file": open("notes.txt", "rb")}
  
  r = requests.post(
    "https://api.hashturn.com/api/tools/text-to-html",
    headers={"Authorization": "Bearer {token}"},
    files=files
  )
  
  print(r.text)
  `,
      },
      sampleResponse: {
        200: "<html>...</html>",
        400: { error: "Only .txt files are supported" },
        500: { error: "Internal server error message" },
      },
    },
  
    {
        id: 14,
      name: "Markdown To HTML",
      slug: "markdown-to-html",
      description: "Convert Markdown text into HTML.",
      method: "POST",
      endpoint: "/api/tools/markdown-to-html",
      headers: {
        Authorization: "Bearer {token}",
        "Content-Type": "multipart/form-data",
      },
      sampleRequest: {
        curl: `
  curl -X POST \\
    -H "Authorization: Bearer {token}" \\
    -F "file=@document.md" \\
    https://api.hashturn.com/api/tools/markdown-to-html
  `,
        js: `
  const form = new FormData();
  form.append("file", markdownFile);
  
  fetch("https://api.hashturn.com/api/tools/markdown-to-html", {
    method: "POST",
    headers: { Authorization: "Bearer {token}" },
    body: form
  }).then(res => res.text());
  `,
        python: `
  import requests
  
  files = {"file": open("document.md", "rb")}
  
  r = requests.post(
    "https://api.hashturn.com/api/tools/markdown-to-html",
    headers={"Authorization": "Bearer {token}"},
    files=files
  )
  
  print(r.text)
  `,
      },
      sampleResponse: {
        200: "<html>...</html>",
        400: { error: "Only .md (Markdown) files are supported" },
        500: { error: "Internal server error message" },
      },
    },
  
    {
        id:15,
      name: "Convert Image",
      slug: "convert-image",
      description: "Convert images to JPG, PNG, WEBP, etc.",
      method: "POST",
      endpoint: "/api/tools/convert-image",
      headers: {
        Authorization: "Bearer {token}",
        "Content-Type": "multipart/form-data",
      },
      sampleRequest: {
        curl: `
  curl -X POST \\
    -H "Authorization: Bearer {token}" \\
    -F "file=@photo.png" \\
    -F "format=jpeg" \\
    -F "quality=70" \\
    https://api.hashturn.com/api/tools/convert-image
  `,
        js: `
  const form = new FormData();
  form.append("file", file);
  form.append("format", "jpeg");
  form.append("quality", "70");
  
  fetch("https://api.hashturn.com/api/tools/convert-image", {
    method: "POST",
    headers: { Authorization: "Bearer {token}" },
    body: form
  }).then(res => res.blob());
  `,
        python: `
  import requests
  
  files = {"file": open("photo.png", "rb")}
  data = {"format": "jpeg", "quality": "70"}
  
  r = requests.post(
    "https://api.hashturn.com/api/tools/convert-image",
    headers={"Authorization": "Bearer {token}"},
    files=files,
    data=data
  )
  
  open("converted.jpeg", "wb").write(r.content)
  `,
      },
      sampleResponse: {
        200: "<binary image>",
        400: [{ error: "Unsupported format" }, { error: "File is required" }],
        500: { error: "Compression failed" },
      },
    },
  ];
  