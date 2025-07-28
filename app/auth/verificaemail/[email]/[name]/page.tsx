import { VerifiForm } from "@/components/auth/verifi-form";

export const dynamic = 'force-dynamic'; 

interface PageProps {
  params: {
    email: string;
    name: string;
  };
}

export default function VerificaremailPage({ params }: PageProps) {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12 px-4 md:px-6 lg:px-8">
      <VerifiForm 
        initialEmail={decodeURIComponent(params.email)} 
        initialName={decodeURIComponent(params.name)} 
      />
    </div>
  );
}