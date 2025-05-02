
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Mail, FileText } from "lucide-react";
import { toast } from "sonner";

const Help = () => {
  const handleContactSupport = () => {
    toast("Support request sent", {
      description: "Our team will get back to you as soon as possible.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-6">
        <div className="container">
          <h1 className="mb-6 text-3xl font-bold">Help & Support</h1>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is AutoPilot?</AccordionTrigger>
                    <AccordionContent>
                      AutoPilot is a platform that helps you automate repetitive tasks across various platforms and services by connecting them through our intuitive interface.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I create my first automation?</AccordionTrigger>
                    <AccordionContent>
                      To create your first automation, go to the dashboard and click on the "Create Automation" button. Follow the steps to connect your desired platforms and define the trigger and actions.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>What integrations are available?</AccordionTrigger>
                    <AccordionContent>
                      We currently support integrations with popular platforms like Google Sheets, Slack, Trello, and many more. You can view the full list in the Integrations section.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Are my API keys secure?</AccordionTrigger>
                    <AccordionContent>
                      Yes, all API keys are encrypted and stored securely. We follow industry best practices for security and never share your data with third parties.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>How do I monitor my automations?</AccordionTrigger>
                    <AccordionContent>
                      You can monitor all your automations from the dashboard. Each automation shows its status, last run time, and any errors that may have occurred. You can also view detailed logs in the Analytics section.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={handleContactSupport}>
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleContactSupport}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email Us
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleContactSupport}>
                  <FileText className="mr-2 h-4 w-4" />
                  Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Help;
