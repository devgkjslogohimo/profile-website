import { requirePermission } from "@/dal/auth"
import { PawartosManager } from "@/features/pawartos/components/pawartos-manager"
import { getPawartos } from "@/features/pawartos/queries/get-pawartos"

async function PawartosPage() {
  const currentUser = await requirePermission("content.create")

  const pawartos = await getPawartos()

  return (
    <PawartosManager
      pawartos={pawartos}
      currentUserId={currentUser.id}
      currentUserRole={currentUser.role}
    />
  )
}

export default PawartosPage
