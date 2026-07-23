import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function upsertCategoryByName(name: string, description?: string) {
  const existing = await prisma.toolCategory.findFirst({ where: { name } });
  if (existing) {
    return prisma.toolCategory.update({ where: { id: existing.id }, data: { description } });
  }
  return prisma.toolCategory.create({ data: { name, description } });
}

async function upsertPlanByName(
  name: string,
  data: {
    price: number;
    durationDays: number;
    maxToolsUsagePerMonth: number | null;
    maxApiCallsPerMonth: number | null;
    maxFileSizeMB: number;
    isFree?: boolean;
  }
) {
  const existing = await prisma.plan.findFirst({ where: { name } });

  if (existing) {
    return prisma.plan.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.plan.create({
    data: { name, ...data },
  });
}

async function upsertToolByName(name: string, slug:string, type:string, categoryId: string, description?: string) {
  const existing = await prisma.tool.findFirst({ where: { name } });
  if (existing) {
    return prisma.tool.update({
      where: { id: existing.id },
      data: { description, categoryId, isActive: true, slug, type },
    });
  }
  return prisma.tool.create({ data: { name, description, slug, type, categoryId, isActive: true} });
}

async function main() {
  // Categories
  const pdfCategory = await upsertCategoryByName("PDFTools", "All PDF-related services");
  const otherCategory = await upsertCategoryByName("OtherTools", "All non-PDF services");

  // Plans
  await Promise.all([
    upsertPlanByName("Free", {
      price: 0,
      durationDays: 30,
      maxToolsUsagePerMonth: 5,
      maxApiCallsPerMonth: 10,
      maxFileSizeMB: 1,
      isFree: true,
    }),
    upsertPlanByName("Premium", {
      price: 9.99,
      durationDays: 30,
      maxToolsUsagePerMonth: 100,
      maxApiCallsPerMonth: 5000,
      maxFileSizeMB: 20,
    }),
    upsertPlanByName("Business", {
      price: 29.99,
      durationDays: 30,
      maxToolsUsagePerMonth: null,
      maxApiCallsPerMonth: null,
      maxFileSizeMB: 50,    
    }),
  ]);

  // Tools - PDFTools
  await Promise.all([
    upsertToolByName("Watermark PDF", "watermark-pdf", "file", pdfCategory.id, "Separate one page or a whole set for easy conversion into independent PDF files."),
    upsertToolByName("Typed To PDF", "typed-to-pdf", "text", pdfCategory.id, "Convert typed content into a clean, formatted PDF document."),
    upsertToolByName("Text To PDF", "text-to-pdf", "file", pdfCategory.id, "Turn plain text files into structured and share-ready PDF documents."),
    upsertToolByName("Split PDF", "split-pdf", "file", pdfCategory.id, "Split large PDF files into smaller, individual PDF documents."),
    upsertToolByName("Reorder Rotate PDF", "reorder-rotate-pdf", "file", pdfCategory.id, "Rearrange or rotate PDF pages to customize document order and orientation."),
    upsertToolByName("Merge PDFs", "merge-pdfs", "file", pdfCategory.id, "Combine multiple PDF documents into a single organized file."),
    upsertToolByName("Markdown To PDF", "markdown-to-pdf", "file", pdfCategory.id, "Transform Markdown content into a styled and printable PDF."),
    upsertToolByName("Images To PDF", "images-to-pdf", "file", pdfCategory.id, "Convert one or multiple images into a single compiled PDF."),
    upsertToolByName("HTML To PDF", "html-to-pdf", "file", pdfCategory.id, "Render HTML content into a clean, printable PDF file."),
    upsertToolByName("Encrypt PDF", "encrypt-pdf", "file", pdfCategory.id, "Secure your PDF with password protection and restricted access."),
  ]);
  
  // Tools - OtherTools
  await Promise.all([
    upsertToolByName("PDF To Images", "pdf-to-images", "file", otherCategory.id, "Convert PDF pages into high-quality image files."),
    upsertToolByName("PDF To Text", "pdf-to-text", "file", otherCategory.id, "Extract readable text from PDF files for easy editing or reuse."),
    upsertToolByName("Text To HTML", "text-to-html", "file", otherCategory.id, "Convert plain text into structured and web-ready HTML."),
    upsertToolByName("Markdown To HTML", "markdown-to-html", "file", otherCategory.id, "Transform Markdown content into clean, formatted HTML."),
    upsertToolByName("Convert Image", "convert-image", "image", otherCategory.id, "Convert images between different formats with ease."),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


