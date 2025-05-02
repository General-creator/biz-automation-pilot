
import React from "react";
import Header from "@/components/Header";
import IntegrationsList from "@/components/IntegrationsList";

// Sample data for integrations
const integrations = [
  {
    id: "i1",
    name: "Zapier",
    logo: "https://cdn.zapier.com/zapier/images/logos/zapier-logo.svg",
    isConnected: true,
    automationCount: 8,
    category: "workflow" as const
  },
  {
    id: "i2",
    name: "Make",
    logo: "https://images.ctfassets.net/qqlj6g4ee76j/7D36NDseRcpUUVLTRCKIXM/cbf2648b639bf89ce7f24d6cf49a0972/make-logo-2.svg",
    isConnected: true,
    automationCount: 5,
    category: "workflow" as const
  },
  {
    id: "i3",
    name: "HubSpot",
    logo: "https://www.hubspot.com/hubfs/assets/hubspot.com/style-guide/brand-guidelines/guidelines_the-logo.svg",
    isConnected: true,
    automationCount: 3,
    category: "crm" as const
  },
  {
    id: "i4",
    name: "Stripe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    isConnected: true,
    automationCount: 2,
    category: "payment" as const
  },
  {
    id: "i5",
    name: "Airtable",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg",
    isConnected: true,
    automationCount: 1,
    category: "data" as const
  },
  {
    id: "i6",
    name: "Gmail",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
    isConnected: false,
    automationCount: 0,
    category: "email" as const
  }
];

const Integrations = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">
            Connect your favorite tools and services
          </p>
        </div>
        
        <IntegrationsList integrations={integrations} />
      </main>
    </div>
  );
};

export default Integrations;
