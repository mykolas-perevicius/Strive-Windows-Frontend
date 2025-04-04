// src/pages/app/settings/SettingsContactPage.tsx
import { Mail, Phone } from "lucide-react"; // Icons

// Dummy contact info - replace with actual data or links
const contactInfo = {
    email: "support@striveapp.example.com",
    phone: "+1 (555) 123-4567", // Example phone
    supportLink: "/support", // Example link to a support form/page
};

export function SettingsContactPage() {
  return (
    <div className="space-y-8">
       <h1 className="text-2xl font-bold">Contact Us</h1>

        <section className="space-y-4">
            <h2 className="text-lg font-semibold">Get Support</h2>
            <p className="text-sm text-muted-foreground">
                Have questions or need help? Reach out to us.
            </p>

            <div className="space-y-3 pt-2">
                {/* Email */}
                <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium">Email</p>
                        <a
                            href={`mailto:${contactInfo.email}`}
                            className="text-sm text-primary underline-offset-4 hover:underline"
                        >
                            {contactInfo.email}
                        </a>
                    </div>
                </div>

                 {/* Phone */}
                 <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium">Phone</p>
                         {/* Avoid making phone clickable if it's just for display */}
                        <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
                         {/* Or make it clickable:
                         <a href={`tel:${contactInfo.phone.replace(/\D/g, '')}`} className="text-sm text-primary underline-offset-4 hover:underline">
                            {contactInfo.phone}
                        </a> */}
                    </div>
                </div>

                {/* Optional: Link to a support page/form */}
                 {/* <div className="flex items-start gap-3">
                    <LifeBuoy className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium">Support Center</p>
                        <Link to={contactInfo.supportLink} className="text-sm text-primary underline-offset-4 hover:underline">
                            Visit our Helpdesk
                        </Link>
                    </div>
                </div> */}
            </div>
        </section>
    </div>
  );
}

export default SettingsContactPage;