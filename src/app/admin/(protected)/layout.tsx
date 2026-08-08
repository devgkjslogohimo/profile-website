import type { ReactNode } from "react"

import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toast"
import { requireUser } from "@/dal/auth"

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const user = await requireUser()

  return (
    <SidebarProvider>
      <AdminSidebar
        user={{
          name: user.name,
          email: user.email,
          role: user.role,
        }}
      />

      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
