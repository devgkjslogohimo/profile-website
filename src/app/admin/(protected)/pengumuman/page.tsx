import { requirePermission } from "@/dal/auth"
import { AnnouncementManager } from "@/features/announcements/components/announcement-manager"
import { getAnnouncements } from "@/features/announcements/queries/get-announcements"

async function AnnouncementsPage() {
  const currentUser = await requirePermission("content.create")

  const announcements = await getAnnouncements()

  return (
    <AnnouncementManager
      announcements={announcements}
      currentUserId={currentUser.id}
      currentUserRole={currentUser.role}
    />
  )
}

export default AnnouncementsPage
