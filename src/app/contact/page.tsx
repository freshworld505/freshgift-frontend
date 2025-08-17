"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiry: "",
  });

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-green-600" />,
      title: "Phone",
      details: "+44 7497 286709",
      description: "Mon-Fri from 8am to 6pm",
    },
    {
      icon: <Mail className="h-6 w-6 text-green-600" />,
      title: "Email",
      details: "support@royalefresh.co.uk",
      description: "We'll respond within 24 hours",
    },
    {
      icon: <MapPin className="h-6 w-6 text-green-600" />,
      title: "Address",
      details: "558-560, Manchester Road, Bradford, United Kingdom, BD5 7LR",
      description: "Green Valley, CA 90210",
    },
    {
      icon: <Clock className="h-6 w-6 text-green-600" />,
      title: "Business Hours",
      details: "Mon-Fri: 8am-6pm",
      description: "Sat-Sun: 9am-5pm",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 24 hours.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      inquiry: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-600 rounded-full">
                <MessageCircle className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Contact <span className="text-green-600">Us</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have a question, feedback, or need assistance? We're here to help!
              Get in touch with our friendly customer support team.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Get in Touch
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  We'd love to hear from you. Send us a message and we'll
                  respond as soon as possible.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">{info.icon}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {info.title}
                          </h3>
                          <p className="text-gray-900 font-medium">
                            {info.details}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* FAQ Section */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-600 pl-4">
                    <h4 className="font-medium text-gray-900">
                      What are your delivery hours?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      We deliver Monday through Friday from 8am to 6pm, and
                      weekends from 9am to 5pm.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-600 pl-4">
                    <h4 className="font-medium text-gray-900">
                      Do you offer same-day delivery?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Yes! Orders placed before 12pm can be delivered the same
                      day for an additional fee.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-600 pl-4">
                    <h4 className="font-medium text-gray-900">
                      What if I'm not satisfied with my order?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      We offer a 100% satisfaction guarantee. Contact us within
                      24 hours for a full refund or replacement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="inquiry">Type of Inquiry</Label>
                      <Select
                        value={formData.inquiry}
                        onValueChange={(value) =>
                          handleInputChange("inquiry", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">
                            General Question
                          </SelectItem>
                          <SelectItem value="order">Order Issue</SelectItem>
                          <SelectItem value="delivery">
                            Delivery Question
                          </SelectItem>
                          <SelectItem value="quality">
                            Product Quality
                          </SelectItem>
                          <SelectItem value="billing">
                            Billing Question
                          </SelectItem>
                          <SelectItem value="partnership">
                            Partnership Inquiry
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        placeholder="Brief description of your message"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        placeholder="Please provide details about your inquiry..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
