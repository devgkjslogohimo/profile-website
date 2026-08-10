import { WorshipServiceRoleManager } from "@/features/worship-service-roles/components/worship-service-role-manager"
import { getWorshipServiceRoles } from "@/features/worship-service-roles/queries/get-worship-service-roles"

export default async function WorshipServiceRolesPage() {
  const roles = await getWorshipServiceRoles()

  return <WorshipServiceRoleManager roles={roles} />
}
