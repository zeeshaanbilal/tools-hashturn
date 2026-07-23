import Services from "@/components/Home/Services";
import { getToolsByCategory } from "@/lib/db";
export default async function PdfServices(){
    const tools = await getToolsByCategory("PDFTools");
    return (
        <div>
            <Services 
                name="PDF Services"
                description="We build modern solutions tailored to your business needs."
                tools={tools}
            />
        </div>
    );
}