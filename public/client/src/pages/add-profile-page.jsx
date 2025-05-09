import { useAuth } from "@/hooks/use-auth";
import ProfileForm from "@/components/profile-form";
import { Card, CardContent } from "@/components/ui/card";

export default function AddProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Add New Profile</h1>
      
      <Card>
        <CardContent className="p-8">
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}