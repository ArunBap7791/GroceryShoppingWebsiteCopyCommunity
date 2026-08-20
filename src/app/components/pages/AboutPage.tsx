import { Heart, Leaf, Users, Award } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function AboutPage() {
  const values = [
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'We partner with local farms that practice sustainable agriculture, reducing our environmental impact while supporting our community.'
    },
    {
      icon: Heart,
      title: 'Quality First',
      description: 'Every product is carefully selected and inspected to ensure you receive only the freshest, highest-quality groceries.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'We believe in supporting local farmers and producers, creating a stronger, more connected community.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Our commitment to excellence drives everything we do, from sourcing to delivery, ensuring your satisfaction.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '50+', label: 'Local Partners' },
    { number: '5 Years', label: 'In Business' },
    { number: '99.9%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-secondary to-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              About The Grocers Market
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're passionate about bringing fresh, quality groceries directly from local farms 
              to your table. Our mission is to make healthy, sustainable food accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="prose prose-lg text-muted-foreground space-y-4">
                <p>
                  Founded in 2019, The Grocers Market began as a simple idea: to connect 
                  our community with the freshest, most sustainable produce available. 
                  What started as a small farmers market booth has grown into a full-service 
                  grocery delivery platform.
                </p>
                <p>
                  We believe that everyone deserves access to fresh, healthy food. That's why 
                  we work directly with over 50 local farms and producers to bring you the 
                  best selection of organic fruits, vegetables, dairy products, and artisanal goods.
                </p>
                <p>
                  Our commitment goes beyond just delivering groceries – we're building a 
                  more sustainable food system that benefits both our customers and our planet.
                </p>
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1747503331142-27f458a1498c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXJzJTIwbWFya2V0JTIwZnJlc2glMjBwcm9kdWNlfGVufDF8fHx8MTc1NjgwNDU1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Farmers market with fresh produce"
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground">The principles that guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-lg rounded-xl">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">By the Numbers</h2>
            <p className="text-muted-foreground">Our impact in the community</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl leading-relaxed">
            To make fresh, sustainable, and healthy food accessible to everyone while 
            supporting local farmers and building stronger communities. We're not just 
            delivering groceries – we're cultivating a better future for our planet and our people.
          </p>
        </div>
      </section>
    </div>
  );
}