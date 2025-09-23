import Link from 'next/link';
import { Wrench, Settings, Home, ArrowRight } from 'lucide-react';

const services = [
  {
    id: 'repair',
    title: 'AC Repair',
    description: 'Expert diagnosis and repair for all AC problems. From minor fixes to major repairs.',
    icon: Wrench,
    features: ['Emergency repairs', 'All AC brands', 'Same-day service', 'Warranty included'],
    price: 'Starting at $99',
    gradient: 'from-red-500 to-orange-400'
  },
  {
    id: 'maintenance',
    title: 'AC Maintenance',
    description: 'Regular maintenance to keep your AC running efficiently and extend its lifespan.',
    icon: Settings,
    features: ['Deep cleaning', 'Filter replacement', 'Performance check', 'Annual contracts'],
    price: 'Starting at $79',
    gradient: 'from-green-500 to-emerald-400'
  },
  {
    id: 'rent',
    title: 'AC Rental',
    description: 'Short-term and long-term AC rental solutions for temporary cooling needs.',
    icon: Home,
    features: ['Flexible terms', 'Installation included', 'Maintenance covered', 'Latest models'],
    price: 'Starting at $50/month',
    gradient: 'from-purple-500 to-violet-400'
  }
];

export default function Services() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Professional Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive AC solutions for residential and commercial properties. 
            Choose the service that fits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${service.gradient} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="h-8 w-8" />
                    <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                      {service.price}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                  <p className="text-white/90">{service.description}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <div className={`w-2 h-2 bg-gradient-to-r ${service.gradient} rounded-full mr-3`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/booking?service=${service.id}`}
                    className={`inline-flex items-center w-full justify-center px-6 py-3 bg-gradient-to-r ${service.gradient} text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                  >
                    Book {service.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Not sure which service you need? Our AI assistant can help you decide.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
