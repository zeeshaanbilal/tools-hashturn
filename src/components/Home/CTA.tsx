import Button from '../ui/Button';

export default function AboutCTA() {
  return (
    <section className="w-full py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div
        >
          <h2 className='mb-6 text-2xl md:text-3xl font-semibold text-typography'>Ready to Transform Your Business?</h2>
          <p className="text-md md:text-lg text-[#4A5565] mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#4A5565" }}
          >
            Let's discuss how HashTurn can help you automate workflows, build scalable applications, and drive innovation in your organization.
          </p>
        </div>

        <div
        >
          <Button className="hero-btn-grad" size="md" href="/contact">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
} 