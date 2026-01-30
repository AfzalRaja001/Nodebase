import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();
  return (
    
    <div>
      Hello
      
    </div>
  );
}; 

export default Page;