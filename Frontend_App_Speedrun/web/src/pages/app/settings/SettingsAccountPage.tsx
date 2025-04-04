// src/pages/app/settings/SettingsAccountPage.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; // Verify this path and component exist
import { Upload, Edit2, Trash2 } from "lucide-react"; // Removed ShieldCheck

// Dummy user data
const userAccount = {
  name: "Mitch",
  email: "m****u@gmail.com",
  phone: "***-***-6789",
  avatarUrl: null,
  initials: "MC",
  isSmsAuthEnabled: true,
};

export function SettingsAccountPage() {
  const handleEditEmail = () => console.log("Edit Email clicked");
  const handleEditPhone = () => console.log("Edit Phone clicked");
  const handleChangePassword = () => console.log("Change Password clicked");
  const handleToggleSmsAuth = () => console.log("Toggle SMS Auth clicked");
  const handleDeleteAccount = () => console.log("Delete Account clicked");
  const handleChangeImage = () => console.log("Change Image clicked");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Account</h1>

      {/* Profile Picture Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Profile Picture</h2>
         <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border">
                <AvatarImage src={userAccount.avatarUrl ?? undefined} alt={userAccount.name} />
                <AvatarFallback>{userAccount.initials}</AvatarFallback>
            </Avatar>
             <Button variant="outline" size="sm" onClick={handleChangeImage}>
                 <Upload className="mr-2 h-4 w-4" /> Change Image
            </Button>
         </div>
         <Separator /> {/* Use Separator here */}
      </section>

      {/* Email & Phone Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Contact Information</h2>
        <div className="space-y-3">
          {/* Email */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-muted-foreground">{userAccount.email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleEditEmail}>
              <Edit2 className="mr-1 h-4 w-4" /> Edit
            </Button>
          </div>
          {/* Phone */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Phone Number</p>
              <p className="text-muted-foreground">{userAccount.phone}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleEditPhone}>
               <Edit2 className="mr-1 h-4 w-4" /> Edit
            </Button>
          </div>
        </div>
         <Separator /> {/* Use Separator here */}
      </section>

      {/* Security Section */}
       <section className="space-y-4">
         <h2 className="text-lg font-semibold">Security</h2>
         <div className="space-y-3">
            {/* Change Password */}
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Password</p>
                 <Button variant="outline" size="sm" onClick={handleChangePassword}>
                    Change Password
                </Button>
            </div>
            {/* SMS Auth */}
            <div className="flex items-center justify-between">
                 <div>
                    <p className="text-sm font-medium">SMS Backup Authentication</p>
                    <p className="text-xs text-muted-foreground">
                      {userAccount.isSmsAuthEnabled ? "Enabled" : "Disabled"}
                    </p>
                 </div>
                 <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleSmsAuth}
                 >
                    {userAccount.isSmsAuthEnabled ? "Remove" : "Enable"} SMS Authentication
                </Button>
            </div>
         </div>
          <Separator /> {/* Use Separator here */}
       </section>

       {/* Danger Zone */}
       <section className="space-y-4">
         <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
         <div className="rounded-lg border border-destructive bg-destructive/5 p-4">
             <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-xs text-muted-foreground">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                </div>
                 <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                     <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                 </Button>
            </div>
         </div>
       </section>
    </div>
  );
}

export default SettingsAccountPage;