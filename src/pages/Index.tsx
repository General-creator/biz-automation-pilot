
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">Welcome to AutoPilot</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            The complete solution for managing and optimizing your business automations
          </p>
          
          <div className="w-full mt-12">
            <EmptyState
              title="Get Started with AutoPilot"
              description="Monitor your automations, track costs, and receive actionable insights to optimize your workflows."
              actionText="Go to Dashboard"
              onAction={goToDashboard}
              icon={<ArrowRight className="h-6 w-6" />}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
