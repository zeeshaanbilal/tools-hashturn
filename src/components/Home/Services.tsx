import Card from "@/components/ui/Card";
import { Tool } from "@prisma/client";
import { FileText, Image as ImageIcon, Lock, PenTool, Scissors, FileCode, FileArchive, Settings, FileOutput, Droplets, RefreshCw, Layers, Globe, Type, Images, Code, ImagePlus, FileSpreadsheet, Presentation, Hash, Wrench, FileDown } from "lucide-react";

interface ServicesProps {
  name:string; 
  description: string; 
  tools: Tool []
}

const getToolStyle = (name: string) => {
  const n = name.toLowerCase();
  
  // Specific mappings for all tools
  if (n === "text to pdf") return { icon: <FileText size={20} />, color: "bg-slate-50 text-slate-600 group-hover:bg-slate-100", titleHover: "group-hover:text-slate-600" };
  if (n === "watermark pdf") return { icon: <Droplets size={20} />, color: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100", titleHover: "group-hover:text-cyan-600" };
  if (n === "split pdf") return { icon: <Scissors size={20} />, color: "bg-red-50 text-red-600 group-hover:bg-red-100", titleHover: "group-hover:text-red-600" };
  if (n === "reorder rotate pdf") return { icon: <RefreshCw size={20} />, color: "bg-purple-50 text-purple-600 group-hover:bg-purple-100", titleHover: "group-hover:text-purple-600" };
  if (n === "encrypt pdf") return { icon: <Lock size={20} />, color: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100", titleHover: "group-hover:text-indigo-600" };
  if (n === "merge pdfs") return { icon: <Layers size={20} />, color: "bg-orange-50 text-orange-600 group-hover:bg-orange-100", titleHover: "group-hover:text-orange-600" };
  if (n === "markdown to pdf") return { icon: <FileCode size={20} />, color: "bg-pink-50 text-pink-600 group-hover:bg-pink-100", titleHover: "group-hover:text-pink-600" };
  if (n === "html to pdf") return { icon: <Globe size={20} />, color: "bg-teal-50 text-teal-600 group-hover:bg-teal-100", titleHover: "group-hover:text-teal-600" };
  if (n === "images to pdf") return { icon: <Images size={20} />, color: "bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100", titleHover: "group-hover:text-yellow-600" };
  if (n === "pdf to text") return { icon: <FileText size={20} />, color: "bg-gray-100 text-gray-700 group-hover:bg-gray-200", titleHover: "group-hover:text-gray-700" };
  if (n === "pdf to images") return { icon: <ImageIcon size={20} />, color: "bg-amber-50 text-amber-600 group-hover:bg-amber-100", titleHover: "group-hover:text-amber-600" };
  if (n === "markdown to html") return { icon: <Code size={20} />, color: "bg-rose-50 text-rose-600 group-hover:bg-rose-100", titleHover: "group-hover:text-rose-600" };
  if (n === "convert image") return { icon: <ImagePlus size={20} />, color: "bg-lime-50 text-lime-600 group-hover:bg-lime-100", titleHover: "group-hover:text-lime-600" };
  if (n === "text to html") return { icon: <FileCode size={20} />, color: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100", titleHover: "group-hover:text-emerald-600" };
  if (n === "pdf to word") return { icon: <FileText size={20} />, color: "bg-blue-100 text-blue-700 group-hover:bg-blue-200", titleHover: "group-hover:text-blue-700" };
  if (n === "pdf to excel") return { icon: <FileSpreadsheet size={20} />, color: "bg-green-100 text-green-700 group-hover:bg-green-200", titleHover: "group-hover:text-green-700" };
  if (n === "pdf to powerpoint") return { icon: <Presentation size={20} />, color: "bg-orange-100 text-orange-700 group-hover:bg-orange-200", titleHover: "group-hover:text-orange-700" };
  if (n === "page numbers") return { icon: <Hash size={20} />, color: "bg-fuchsia-50 text-fuchsia-600 group-hover:bg-fuchsia-100", titleHover: "group-hover:text-fuchsia-600" };
  if (n === "repair pdf") return { icon: <Wrench size={20} />, color: "bg-teal-100 text-teal-700 group-hover:bg-teal-200", titleHover: "group-hover:text-teal-700" };
  if (n === "pdf to markdown") return { icon: <FileDown size={20} />, color: "bg-violet-50 text-violet-600 group-hover:bg-violet-100", titleHover: "group-hover:text-violet-600" };

  return { icon: <Settings size={20} />, color: "bg-slate-50 text-slate-600 group-hover:bg-slate-100", titleHover: "group-hover:text-slate-600" };
};

export default function Services({name, description, tools } : ServicesProps) {
  return (
    <section className="w-full">
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-10">
              <div className="mx-auto mb-3 h-1 w-6 rounded bg-primary"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-typography">{name}</h2>
              <p className="mt-2 text-md md:text-lg text-[#4A5565] mb-8 max-w-2xl mx-auto leading-relaxed">
                  {description}
              </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {tools.map((tool: Tool) => {
                  const style = getToolStyle(tool.name);
                  return (
                    <Card
                      key={tool.id}
                      title={tool.name}
                      description={tool.description || ""}
                      href={`/tools/${tool.slug}`}
                      icon={style.icon}
                      iconWrapperClassName={style.color}
                      titleClassName={style.titleHover}
                    />
                  );
              })}
            </div>
        </div>
    </section>
  );
}