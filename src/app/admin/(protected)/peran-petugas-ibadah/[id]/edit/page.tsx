import { notFound } from "next/navigation"

import { EditWorshipServiceRoleView } from "@/features/worship-service-roles/components/edit-worship-service-role-view"
import { getWorshipServiceRole } from "@/features/worship-service-roles/queries/get-worship-service-role"

export default async function EditWorshipServiceRolePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const role = await getWorshipServiceRole(id)

  if (!role) {
    notFound()
  }

  return <EditWorshipServiceRoleView role={role} />
}
