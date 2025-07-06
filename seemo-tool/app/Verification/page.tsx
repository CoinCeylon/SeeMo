import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { InputForm1 } from "./input-form1";

export default function Verification() {
  return (
    <>
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <InputForm1 />
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
