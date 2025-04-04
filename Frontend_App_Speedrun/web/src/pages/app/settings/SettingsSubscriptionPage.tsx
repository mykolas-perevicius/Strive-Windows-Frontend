// src/pages/app/settings/SettingsSubscriptionPage.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react"; // Example icon

// Dummy subscription data - replace with actual user data
const userSubscription = {
  plan: "Basic", // 'Basic' or 'Premium'
  status: "Active", // 'Active', 'Inactive', 'Trial', etc.
  isPremium: false, // Derived or direct flag
};

export function SettingsSubscriptionPage() {

  const handleManageSubscription = () => {
    console.log("Manage Subscription / Upgrade clicked");
    // Add logic to redirect to billing portal or show upgrade modal
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Subscription</h1>

      <section>
        <h2 className="text-lg font-semibold mb-1">Current Plan</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Manage your subscription details and billing information.
        </p>

        {/* Display cards side-by-side on larger screens */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Basic Plan Card (Always show, indicate if active) */}
          <Card className={userSubscription.plan === 'Basic' ? 'border-primary' : ''}>
            <CardHeader>
              <CardTitle>Basic Plan</CardTitle>
              <CardDescription>For individuals getting started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold">Free</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Basic Workout Tracking</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Limited History</li>
              </ul>
            </CardContent>
            <CardFooter>
              {userSubscription.plan === 'Basic' ? (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button className="w-full" variant="outline" onClick={handleManageSubscription}>
                  Downgrade
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Premium Plan Card (Always show, indicate if active or offer upgrade) */}
           <Card className={userSubscription.plan === 'Premium' ? 'border-primary' : ''}>
            <CardHeader>
              <CardTitle>Premium Plan</CardTitle>
              <CardDescription>Unlock advanced features and insights.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold">$X.XX <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
               <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Advanced Analytics</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Unlimited History</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Priority Support</li>
              </ul>
            </CardContent>
            <CardFooter>
              {userSubscription.plan === 'Premium' ? (
                 <Button className="w-full" variant="outline" onClick={handleManageSubscription}>
                  Manage Subscription
                </Button>
              ) : (
                <Button className="w-full" onClick={handleManageSubscription}>
                  Upgrade to Premium
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Optionally add Billing History or other relevant sections */}
      {/* <Separator className="my-6" />
      <section> ... Billing History ... </section> */}
    </div>
  );
}

export default SettingsSubscriptionPage;