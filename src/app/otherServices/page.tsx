// app/otherServices/page.tsx
import Services from "@/components/Home/Services";
import { getToolsByCategory } from "@/lib/db";
import { testDatabaseConnection } from "@/lib/test-db";

export const dynamic = 'force-dynamic'; // Skip static generation

export default async function OtherServices() {
  // Test connection first (optional)
  const isConnected = await testDatabaseConnection();
  
  if (!isConnected) {
    console.error("Database not connected, using fallback");
    return (
      <Services 
        name="Other Services"
        description="We build modern solutions tailored to your business needs."
        tools={[]}
      />
    );
  }
  
  const tools = await getToolsByCategory("OtherTools");
  
  return (
    <div>
      <Services 
        name="Other Services"
        description="We build modern solutions tailored to your business needs."
        tools={tools}
      />
    </div>
  );
}
// import Services from "@/components/Home/Services";
// import { getToolsByCategory } from "@/lib/db";
// import { prisma } from "@/lib/prisma";
// export default async function OtherServices(){
//     const tools = await getToolsByCategory("OtherTools")
//     return (
//         <div>
//             <Services 
//                 name="Other Services"
//                 description="We build modern solutions tailored to your business needs."
//                 tools={tools}
//             />
//         </div>
//     );
// }