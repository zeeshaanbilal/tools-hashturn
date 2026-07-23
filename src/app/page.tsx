import Hero from "@/components/Home/Hero";
import Services from "@/components/Home/Services";
import WhyChooseUs from "@/components/Home/WhyChooseUs";
import CTA from "@/components/Home/CTA";
import { prisma } from "@/lib/prisma";
import { getTools } from "@/lib/db";
import ThemeToggle from "@/components/ThemeToggle";
export default async function Home() {
  const tools = await getTools();

  return (
    <div className="flex flex-col">
      {/* <div className="absolute top-[100px] right-[100px]">
        <ThemeToggle/>
      </div> */}
      <Services 
        name="Services"
        description="We build modern solutions tailored to your business needs."
        tools={tools}
      />
      <Hero />
      <WhyChooseUs />
      <CTA />
    </div>
  );
}
