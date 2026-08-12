import { notFound } from "next/navigation"

import { requirePermission } from "@/dal/auth"
import { EditUserView } from "@/features/users/components/edit-user-view"
import { getUser } from "@/features/users/queries/get-user"

type EditUserPageProps = {
  params: Promise<{
    id: string
  }>
}

async function EditUserPage({ params }: EditUserPageProps) {
  const currentUser = await requirePermission("users.manage")

  const { id } = await params

  const user = await getUser(id)

  if (!user) {
    notFound()
  }

  return (
    <EditUserView
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }}
      currentUserId={currentUser.id}
    />
  )
}

export default EditUserPage
