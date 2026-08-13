import { ArrowLeft, Pencil, Plus, UsersRound } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateAssignmentForm } from "@/features/worship-schedules/components/create-assignment-form"
import { CreateServiceForm } from "@/features/worship-schedules/components/create-service-form"
import { DeleteAssignmentButton } from "@/features/worship-schedules/components/delete-assignment-button"
import { DeleteServiceButton } from "@/features/worship-schedules/components/delete-service-button"
import { PublicationButton } from "@/features/worship-schedules/components/publication-button"
import { ReorderAssignmentButtons } from "@/features/worship-schedules/components/reorder-assignment-buttons"
import { ReorderServiceButtons } from "@/features/worship-schedules/components/reorder-service-buttons"
import { UpdateAssignmentForm } from "@/features/worship-schedules/components/update-assignment-form"
import { UpdateScheduleForm } from "@/features/worship-schedules/components/update-schedule-form"
import { UpdateServiceForm } from "@/features/worship-schedules/components/update-service-form"
import { getWibTime } from "@/features/worship-schedules/lib/date-time"
import {
  formatPublishedAt,
  formatScheduleDate,
  getScheduleDateInputValue,
} from "@/features/worship-schedules/lib/format"

import {
  getDefaultWorshipLanguage,
  getWorshipLanguageLabel,
  resolveWorshipLanguage,
  WorshipLanguage,
} from "../lib/worship-language"
import { DuplicateScheduleButton } from "./duplicate-schedule-button"

type ChurchLocationOption = {
  id: string
  name: string
  type: "CHURCH" | "PEPANTHAN"
  sortOrder: number
}

type WorshipServiceRoleOption = {
  id: string
  name: string
  sortOrder: number
}

type WorshipScheduleDetailProps = {
  schedule: {
    id: string
    date: Date
    isPublished: boolean
    publishedAt: Date | null
    services: {
      id: string
      name: string
      startsAt: Date
      languageOverride: WorshipLanguage | null
      sortOrder: number
      churchLocationId: string
      churchLocation: {
        id: string
        name: string
        type: "CHURCH" | "PEPANTHAN"
        isActive: boolean
      }
      assignments: {
        id: string
        personName: string
        sortOrder: number
        worshipServiceRoleId: string
        worshipServiceRole: {
          id: string
          name: string
          sortOrder: number
          isActive: boolean
        }
      }[]
    }[]
  }
  locations: ChurchLocationOption[]
  roles: WorshipServiceRoleOption[]
}

function WorshipScheduleDetail({ schedule, locations, roles }: WorshipScheduleDetailProps) {
  const label = formatScheduleDate(schedule.date)
  const automaticLanguage = getDefaultWorshipLanguage(schedule.date)

  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/jadwal-ibadah"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          <ArrowLeft />
          Kembali
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Jadwal Ibadah</p>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
                {label}
              </h1>

              <Badge variant={schedule.isPublished ? "secondary" : "outline"}>
                {schedule.isPublished ? "Terbit" : "Draft"}
              </Badge>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              {schedule.services.length} ibadah dalam jadwal ini
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DuplicateScheduleButton scheduleId={schedule.id} scheduleLabel={label} />

            <PublicationButton id={schedule.id} isPublished={schedule.isPublished} />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Jadwal</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-muted-foreground">Tanggal</p>
              <p className="mt-1 font-medium">{label}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="mt-1 font-medium">
                {schedule.isPublished ? "Dipublikasikan" : "Draft"}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Terakhir Dipublikasikan</p>

              <p className="mt-1 font-medium">
                {schedule.publishedAt
                  ? `${formatPublishedAt(schedule.publishedAt)} WIB`
                  : "Belum pernah dipublikasikan"}
              </p>
            </div>
          </div>

          {!schedule.isPublished ? (
            <details className="rounded-xl border">
              <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
                <Pencil className="size-4" />
                Ubah Tanggal Jadwal
              </summary>

              <div className="border-t p-4">
                <UpdateScheduleForm
                  schedule={{
                    id: schedule.id,
                    date: getScheduleDateInputValue(schedule.date),
                    isPublished: schedule.isPublished,
                  }}
                />
              </div>
            </details>
          ) : null}
        </CardContent>
      </Card>

      {!schedule.isPublished ? (
        <Card>
          <CardContent className="pt-6">
            <details>
              <summary className="flex cursor-pointer list-none items-center gap-2 font-medium [&::-webkit-details-marker]:hidden">
                <Plus className="size-4" />
                Tambah Ibadah
              </summary>

              <div className="mt-5 border-t pt-5">
                {locations.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-6">
                    <p className="text-sm font-medium">Tidak ada lokasi aktif</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Aktifkan minimal satu Gereja atau Pepanthan terlebih dahulu.
                    </p>
                  </div>
                ) : (
                  <CreateServiceForm
                    worshipScheduleId={schedule.id}
                    locations={locations}
                    automaticLanguage={automaticLanguage}
                  />
                )}
              </div>
            </details>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-semibold">Daftar Ibadah</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola ibadah dan petugas pada tanggal ini.
          </p>
        </div>

        {schedule.services.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-sm font-medium">Belum ada ibadah</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan minimal satu ibadah sebelum jadwal dipublikasikan.
              </p>
            </CardContent>
          </Card>
        ) : (
          schedule.services.map((service, serviceIndex) => (
            <Card key={service.id} className="overflow-hidden">
              <CardHeader className="border-b">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <CardTitle>{service.name}</CardTitle>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{service.churchLocation.name}</Badge>

                      {!service.churchLocation.isActive ? (
                        <Badge variant="outline">Lokasi Nonaktif</Badge>
                      ) : null}

                      <Badge variant="secondary">{getWibTime(service.startsAt)} WIB</Badge>

                      <Badge variant="outline">
                        {getWorshipLanguageLabel(
                          resolveWorshipLanguage(schedule.date, service.languageOverride)
                        )}
                      </Badge>

                      {service.languageOverride === null ? (
                        <span className="text-xs text-muted-foreground">Otomatis</span>
                      ) : null}

                      {!service.churchLocation.isActive ? (
                        <p className="mt-3 text-sm text-destructive">
                          Lokasi ini sudah nonaktif. Pilih lokasi aktif sebelum jadwal
                          dipublikasikan.
                        </p>
                      ) : null}

                      <span className="text-xs text-muted-foreground">
                        Urutan {service.sortOrder}
                      </span>
                    </div>
                  </div>

                  {!schedule.isPublished ? (
                    <div className="flex items-center gap-2">
                      <ReorderServiceButtons
                        id={service.id}
                        name={service.name}
                        canMoveUp={serviceIndex > 0}
                        canMoveDown={serviceIndex < schedule.services.length - 1}
                      />

                      <DeleteServiceButton id={service.id} name={service.name} />
                    </div>
                  ) : null}
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                <section>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <UsersRound className="size-4 text-muted-foreground" />
                        <h3 className="font-medium">Petugas Ibadah</h3>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {service.assignments.length} petugas
                      </p>
                    </div>
                  </div>

                  {service.assignments.length === 0 ? (
                    <div className="mt-4 rounded-xl border border-dashed p-5 text-center">
                      <p className="text-sm text-muted-foreground">
                        Belum ada petugas pada ibadah ini.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 divide-y rounded-xl border">
                      {service.assignments.map((assignment, assignmentIndex) => (
                        <div key={assignment.id} className="p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline">
                                  {assignment.worshipServiceRole.name}
                                </Badge>

                                {!assignment.worshipServiceRole.isActive ? (
                                  <Badge variant="outline">Nonaktif</Badge>
                                ) : null}
                              </div>

                              <p className="mt-2 font-medium">{assignment.personName}</p>
                            </div>

                            {!schedule.isPublished ? (
                              <div className="flex items-center gap-2">
                                <ReorderAssignmentButtons
                                  id={assignment.id}
                                  personName={assignment.personName}
                                  canMoveUp={assignmentIndex > 0}
                                  canMoveDown={assignmentIndex < service.assignments.length - 1}
                                />

                                <DeleteAssignmentButton
                                  id={assignment.id}
                                  personName={assignment.personName}
                                />
                              </div>
                            ) : null}
                          </div>

                          {!schedule.isPublished ? (
                            <details className="mt-3">
                              <summary className="flex cursor-pointer list-none items-center gap-2 text-sm text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
                                <Pencil className="size-3.5" />
                                Edit Petugas
                              </summary>

                              <div className="mt-4 rounded-xl bg-muted/30 p-4">
                                <UpdateAssignmentForm assignment={assignment} roles={roles} />
                              </div>
                            </details>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}

                  {!schedule.isPublished ? (
                    <details className="mt-4 rounded-xl border border-dashed">
                      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
                        <Plus className="size-4" />
                        Tambah Petugas
                      </summary>

                      <div className="border-t p-4">
                        {roles.length === 0 ? (
                          <div className="rounded-xl border border-dashed p-4">
                            <p className="text-sm font-medium">Tidak ada peran petugas aktif</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Aktifkan master Peran Petugas Ibadah terlebih dahulu.
                            </p>
                          </div>
                        ) : (
                          <CreateAssignmentForm worshipServiceId={service.id} roles={roles} />
                        )}
                      </div>
                    </details>
                  ) : null}
                </section>

                {!schedule.isPublished ? (
                  <details className="border-t pt-4">
                    <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium [&::-webkit-details-marker]:hidden">
                      <Pencil className="size-4" />
                      Edit Informasi Ibadah
                    </summary>

                    <div className="mt-4 rounded-xl bg-muted/30 p-4">
                      <UpdateServiceForm
                        service={{
                          id: service.id,
                          name: service.name,

                          churchLocationId: service.churchLocationId,

                          churchLocation: service.churchLocation,

                          startTime: getWibTime(service.startsAt),

                          languageOverride: service.languageOverride,
                        }}
                        locations={locations}
                        automaticLanguage={automaticLanguage}
                      />
                    </div>
                  </details>
                ) : null}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}

export { WorshipScheduleDetail }
