import { WebsiteSettingForm } from "@/features/website-settings/components/website-setting-form"
import { getWebsiteSetting } from "@/features/website-settings/queries/get-website-setting"

async function WebsiteSettingPage() {
  const setting = await getWebsiteSetting()

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Sistem</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Pengaturan Website
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola identitas, informasi kontak, dan media sosial yang digunakan pada website.
        </p>
      </div>

      <WebsiteSettingForm
        setting={
          setting
            ? {
                siteName: setting.siteName,
                tagline: setting.tagline,
                description: setting.description,
                email: setting.email,
                phone: setting.phone,
                whatsapp: setting.whatsapp,
                facebookUrl: setting.facebookUrl,
                instagramUrl: setting.instagramUrl,
                youtubeUrl: setting.youtubeUrl,
              }
            : null
        }
      />

      <p className="text-xs text-muted-foreground">
        Logo dan favicon tidak dikelola dari halaman ini karena menggunakan file statis di dalam
        project.
      </p>
    </main>
  )
}

export default WebsiteSettingPage
