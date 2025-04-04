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

        {/* Use grid, ensure cards can stretch vertically */}
        <div className="grid gap-6 sm:grid-cols-2 items-stretch"> {/* Added items-stretch */}
          {/* Basic Plan Card */}
          {/* Added flex, flex-col, and justify-between to make footer stick to bottom */}
          <Card className={`flex flex-col justify-between ${userSubscription.plan === 'Basic' ? 'border-primary' : ''}`}>
            <div> {/* Wrap Header and Content */}
                <CardHeader>
                  <CardTitle>Basic Plan</CardTitle>
                  <CardDescription>For individuals getting started.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-3xl font-bold">Free</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" /> <span>Basic Workout Tracking</span></li> {/* Added flex-shrink-0 to icon */}
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" /> <span>Limited History</span></li> {/* Added flex-shrink-0 to icon */}
                  </ul>
                </CardContent>
            </div>
            <CardFooter>
              {userSubscription.plan === 'Basic' ? (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              ) : (
                 // This button wouldn't typically appear if user is premium, but included for structure
                 <Button className="w-full" variant="outline" onClick={handleManageSubscription}>
                   Downgrade to Basic (Example)
                 </Button>
              )}
            </CardFooter>
          </Card>

          {/* Premium Plan Card */}
           {/* Added flex, flex-col, and justify-between */}
           <Card className={`flex flex-col justify-between ${userSubscription.plan === 'Premium' ? 'border-primary' : ''}`}>
             <div> {/* Wrap Header and Content */}
                <CardHeader>
                  <CardTitle>Premium Plan</CardTitle>
                  <CardDescription>Unlock advanced features and insights.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-3xl font-bold">$X.XX <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
                   <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" /> <span>Advanced Analytics</span></li> {/* Added flex-shrink-0 */}
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" /> <span>Unlimited History</span></li> {/* Added flex-shrink-0 */}
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" /> <span>Priority Support</span></li> {/* Added flex-shrink-0 */}
                  </ul>
                </CardContent>
            </div>
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