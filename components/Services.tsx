import { Smartphone, Wifi, Zap, Send, RefreshCw, History } from 'lucide-react';

const services = [
  {
    icon: Smartphone,
    title: "Airtime Recharge",
    description: "Instant airtime top-up for all Nigerian networks with best rates.",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400"
  },
  {
    icon: Wifi,
    title: "Data Recharge",
    description: "Affordable data plans for MTN, Glo, Airtel, and 9mobile.",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400"
  },
  {
    icon: Zap,
    title: "Utilities Payment",
    description: "Pay electricity bills, water bills, and cable TV subscriptions seamlessly.",
    color: "from-yellow-500/20 to-yellow-500/5",
    iconColor: "text-yellow-400"
  },
  {
    icon: Send,
    title: "Money Transfer",
    description: "Send money to any bank account or Creda Chain user instantly.",
    color: "from-green-500/20 to-green-500/5",
    iconColor: "text-green-400"
  },
  {
    icon: RefreshCw,
    title: "USDT to Naira",
    description: "Convert cryptocurrency to Naira at best market rates.",
    color: "from-purple-500/20 to-purple-500/5",
    iconColor: "text-purple-400"
  },
  {
    icon: History,
    title: "Transaction History",
    description: "View and manage all your payment history in one secure place.",
    color: "from-pink-500/20 to-pink-500/5",
    iconColor: "text-pink-400"
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 bg-[#05081A] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            All Your Payments in One Place
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Complete payment solutions for your everyday needs, powered by secure blockchain technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}>
                <service.icon className={`w-6 h-6 ${service.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
