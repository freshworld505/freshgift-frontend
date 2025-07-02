"use client";

import { Leaf, Users, Heart, Award, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      icon: <Leaf className="h-12 w-12 text-green-600" />,
      title: "Farm Fresh",
      description:
        "We source directly from local farms to ensure the freshest produce reaches your table.",
    },
    {
      icon: <Heart className="h-12 w-12 text-red-500" />,
      title: "Community First",
      description:
        "Supporting local farmers and communities while delivering quality to your doorstep.",
    },
    {
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      title: "Quality Assured",
      description:
        "Every product is carefully inspected to meet our high standards of freshness and quality.",
    },
    {
      icon: <Truck className="h-12 w-12 text-orange-600" />,
      title: "Fast Delivery",
      description:
        "Quick and reliable delivery service to ensure your produce stays fresh.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "50+", label: "Local Farms" },
    { number: "500+", label: "Fresh Products" },
    { number: "24/7", label: "Customer Support" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-600 rounded-full">
                <Leaf className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-green-600">FreshGift</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're passionate about bringing farm-fresh produce directly to
              your doorstep. Since our founding, we've been committed to
              supporting local farmers while providing our customers with the
              highest quality fruits and vegetables.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  FreshGift was born from a simple idea: everyone deserves
                  access to fresh, high-quality produce without the hassle of
                  visiting multiple stores or worrying about freshness.
                </p>
                <p>
                  Our founders, passionate about healthy living and supporting
                  local communities, noticed the gap between farm-fresh produce
                  and busy consumers. They set out to create a bridge that would
                  benefit both farmers and families.
                </p>
                <p>
                  Today, we work with over 50 local farms, delivering fresh
                  produce to thousands of happy customers while supporting
                  sustainable farming practices and local economies.
                </p>
              </div>
              <Button asChild className="mt-6 bg-green-600 hover:bg-green-700">
                <Link href="/products">Shop Now</Link>
              </Button>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <Users className="h-24 w-24 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Built for Community
                </h3>
                <p className="text-gray-600">Connecting farms to families</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              By the Numbers
            </h2>
            <p className="text-xl text-gray-600">Our impact in the community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience Fresh?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust FreshGift for their
            fresh produce needs.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-white text-green-600 hover:bg-gray-100"
          >
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
