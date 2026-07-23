import { prisma } from "./prisma";

export async function getToolsByCategory(category:string){
  try {
    const tools = await prisma.tool.findMany({
        where: {
            category : {
                name : category
            } 
        }
    });
    return tools;
  } catch (e) {
    console.error("DB error in getToolsByCategory:", e);
    return [];
  }
}

export async function getToolsBySlug(slug:string){
  try {
    const tools = await prisma.tool.findFirst({
        where: {
            slug : slug
        }
    });
    return tools;
  } catch (e) {
    console.error("DB error in getToolsBySlug:", e);
    return null;
  }
}

export async function getTools(limit?:number){
  try {
    const tools = await prisma.tool.findMany({
        ...(limit ? { take: limit } : {}),
      });
    return tools;
  } catch (e) {
    console.error("DB error in getTools:", e);
    return [];
  }
}