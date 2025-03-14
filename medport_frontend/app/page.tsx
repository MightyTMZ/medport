"use client";

import { Card } from "@/components/ui/card";
import { Pill as Pills, Shield, Brain, UserCog, Activity, Watch, FileText, MessageSquareQuote as MessageSquareQuestion, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: <Pills className="w-8 h-8 text-blue-600" />,
      title: "Medication Management",
      description: "Track and manage your medications with smart reminders"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Secure Access",
      description: "Your medical data is protected with enterprise-grade security"
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "AI Health Assistant",
      description: "Get personalized health insights and recommendations"
    },
    {
      icon: <UserCog className="w-8 h-8 text-indigo-600" />,
      title: "Doctor Matchmaking",
      description: "Find the right healthcare provider for your needs"
    },
    {
      icon: <Activity className="w-8 h-8 text-red-600" />,
      title: "Vital Sign Monitoring",
      description: "Track your health metrics in real-time"
    },
    {
      icon: <Watch className="w-8 h-8 text-cyan-600" />,
      title: "Wearable Integration",
      description: "Connect with your favorite health devices"
    }
  ];

  const quickActions = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Export Medical Report",
      description: "Download your health summary"
    },
    {
      icon: <MessageSquareQuestion className="w-6 h-6" />,
      title: "Ask Health Questions",
      description: "Get answers from our AI assistant"
    },
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Check Vital Signs",
      description: "View your latest health metrics"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 rounded-full">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-gray-50 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Medical Disclaimer */}
        <section className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Medical Disclaimer</h3>
          <p className="text-gray-600">
            MedPort is designed to support, not replace, the relationship between patients and their healthcare providers. 
            Always consult with qualified healthcare professionals for medical advice and treatment decisions.
          </p>
        </section>
      </main>
    </div>
  );
}