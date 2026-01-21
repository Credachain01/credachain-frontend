export default function CTA() {
  return (
    <section className="py-24 bg-[#05081A] relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#1a1f3e] to-[#0a0d1f] border border-white/10 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center py-16 md:py-20 px-6 md:px-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-3xl mx-auto">
              Ready to Experience Secure Payments?
            </h2>
            <p className="text-gray-400 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of businesses and individuals using Creda Chain for all their payment needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                Launch app
              </button>
              <button className="px-8 py-3.5 border border-white/30 text-white font-semibold rounded-full hover:bg-white/5 transition-all duration-300">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
