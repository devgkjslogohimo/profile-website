import { requirePermission } from "@/dal/auth"
import { UserManager } from "@/features/users/components/user-manager"
import { getUsers } from "@/features/users/queries/get-users"

async function UsersPage() {
  const currentUser = await requirePermission("users.manage")
  const users = await getUsers()

  return <UserManager users={users} currentUserId={currentUser.id} />
}

export default UsersPage
