import { requirePermission } from "@/dal/auth"
import { AgendaManager } from "@/features/agenda/components/agenda-manager"
import { getAgendas } from "@/features/agenda/queries/get-agendas"

async function AgendaPage() {
  const currentUser = await requirePermission("content.create")

  const agendas = await getAgendas()

  return (
    <AgendaManager
      agendas={agendas}
      currentUserId={currentUser.id}
      currentUserRole={currentUser.role}
    />
  )
}

export default AgendaPage
