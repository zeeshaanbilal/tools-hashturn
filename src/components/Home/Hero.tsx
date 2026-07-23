import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-4">
          <Button
            href="/pdfServices"
            className="hero-btn-grad"
            size="md"
          >
            Explore PDF Services
          </Button>
          <Button
            href="/apiAccess"
            variant="outline"
            size="md"
          >
            Discover API Access
          </Button>
        </div>
      </div>
    </section>
  );
}