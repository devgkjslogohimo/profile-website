import { ChurchFormManager } from "@/features/church-forms/components/church-form-manager"
import { getChurchForms } from "@/features/church-forms/queries/get-church-forms"

async function ChurchFormsPage() {
  const churchForms = await getChurchForms()

  return <ChurchFormManager churchForms={churchForms} />
}

export default ChurchFormsPage
