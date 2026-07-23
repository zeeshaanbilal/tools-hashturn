import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const newTools = [
      {
        name: 'Page numbers',
        slug: 'page-numbers',
        description: 'Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.'
      },
      {
        name: 'Repair PDF',
        slug: 'repair-pdf',
        description: 'Repair a damaged PDF and recover data from corrupt PDF. Fix PDF files with our Repair tool.'
      },
      {
        name: 'PDF to Markdown',
        slug: 'pdf-to-markdown',
        description: 'Easily convert PDF files to Markdown. Keep fonts, layout, and formatting intact.'
      }
    ];

    const cat = await prisma.toolCategory.findFirst();
    const categoryId = cat ? cat.id : 'unknown';

    for (const tool of newTools) {
      const existing = await prisma.tool.findFirst({ where: { slug: tool.slug } });
      if (!existing) {
        await prisma.tool.create({ data: { ...tool, type: 'pdf', categoryId } });
        console.log(`Created tool: ${tool.name}`);
      } else {
        console.log(`Tool already exists: ${tool.name}`);
      }
    }
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
