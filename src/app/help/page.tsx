"use client";

import { useState } from "react";
import {
  HelpCircle,
  Search,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    {
      title: "Orders & Delivery",
      icon: "🚚",
      topics: [
        "Track Order",
        "Delivery Times",
        "Order Issues",
        "Cancellations",
      ],
    },
    {
      title: "Products & Quality",
      icon: "🥕",
      topics: [
        "Freshness Guarantee",
        "Product Information",
        "Organic Options",
        "Storage Tips",
      ],
    },
    {
      title: "Account & Billing",
      icon: "💳",
      topics: [
        "Payment Methods",
        "Account Settings",
        "Refunds",
        "Subscriptions",
      ],
    },
    {
      title: "Technical Support",
      icon: "⚙️",
      topics: ["App Issues", "Website Problems", "Login Help", "Mobile App"],
    },
  ];

  const faqs = [
    {
      question: "How can I track my order?",
      answer:
        "You can track your order by logging into your account and clicking on 'Track Order' in the menu, or by visiting the tracking page and entering your order number.",
      category: "Orders",
    },
    {
      question: "What are your delivery hours?",
      answer:
        "We deliver Monday through Friday from 8am to 6pm, and weekends from 9am to 5pm. Same-day delivery is available for orders placed before 12pm.",
      category: "Delivery",
    },
    {
      question: "What if my produce isn't fresh?",
      answer:
        "We guarantee 100% freshness. If you're not satisfied with any product, contact us within 24 hours for a full refund or replacement at no cost to you.",
      category: "Quality",
    },
    {
      question: "Do you offer organic products?",
      answer:
        "Yes! We have a wide selection of certified organic fruits and vegetables. Look for the 'Organic' label on product pages or filter by organic in our products section.",
      category: "Products",
    },
    {
      question: "How do I cancel or modify my order?",
      answer:
        "Orders can be cancelled or modified up to 2 hours after placement. Contact customer service or use the 'Manage Order' feature in your account.",
      category: "Orders",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay for your convenience.",
      category: "Payment",
    },
    {
      question: "Do you deliver to my area?",
      answer:
        "We currently deliver to most areas within 50 miles of major metropolitan areas. Enter your zip code at checkout to see if delivery is available in your location.",
      category: "Delivery",
    },
    {
      question: "How should I store my produce?",
      answer:
        "Storage instructions are provided with each product. Generally, keep fruits and vegetables in the refrigerator and use within the recommended timeframe for best freshness.",
      category: "Storage",
    },
  ];

  const contactOptions = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      description: "Speak with our support team",
      detail: "+1 (555) 123-4567",
      hours: "Mon-Fri 8am-6pm",
      action: "Call Now",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Get help via email",
      detail: "support@RoyalFresh.com",
      hours: "24-hour response",
      action: "Send Email",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Live Chat",
      description: "Chat with an agent",
      detail: "Available now",
      hours: "Mon-Fri 9am-5pm",
      action: "Start Chat",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-600 rounded-full">
                <HelpCircle className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Help <span className="text-blue-600">Center</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find answers to common questions, get support, and learn how to
              make the most of RoyalFresh.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-0 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Help Categories */}
          {!searchTerm && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Browse by Category
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{category.icon}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {category.title}
                      </h3>
                      <div className="space-y-2">
                        {category.topics.map((topic, topicIndex) => (
                          <Badge
                            key={topicIndex}
                            variant="secondary"
                            className="text-xs"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {searchTerm
                  ? `Search Results (${filteredFaqs.length})`
                  : "Frequently Asked Questions"}
              </h2>
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <Card key={index} className="border-0 shadow-md">
                    <CardHeader
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() =>
                        setExpandedFaq(expandedFaq === index ? null : index)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-gray-900 pr-4">
                          {faq.question}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                          {expandedFaq === index ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {expandedFaq === index && (
                      <CardContent className="pt-0">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Still Need Help?
              </h3>
              <div className="space-y-6">
                {contactOptions.map((option, index) => (
                  <Card key={index} className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {option.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {option.description}
                          </p>
                          <p className="font-medium text-gray-900">
                            {option.detail}
                          </p>
                          <p className="text-gray-500 text-xs mb-3">
                            {option.hours}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            {option.action}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Links */}
              <Card className="border-0 shadow-md mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link
                      href="/track"
                      className="block text-blue-600 hover:text-blue-800 text-sm"
                    >
                      → Track Your Order
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block text-blue-600 hover:text-blue-800 text-sm"
                    >
                      → Order History
                    </Link>
                    <Link
                      href="/account"
                      className="block text-blue-600 hover:text-blue-800 text-sm"
                    >
                      → Account Settings
                    </Link>
                    <Link
                      href="/contact"
                      className="block text-blue-600 hover:text-blue-800 text-sm"
                    >
                      → Contact Us
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
