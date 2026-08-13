import { requirePermission } from "@/dal/auth"
import { NewsManager } from "@/features/news/components/news-manager"
import { getNews } from "@/features/news/queries/get-news"

async function NewsPage() {
  const currentUser = await requirePermission("content.create")

  const news = await getNews()

  return (
    <NewsManager news={news} currentUserId={currentUser.id} currentUserRole={currentUser.role} />
  )
}

export default NewsPage
