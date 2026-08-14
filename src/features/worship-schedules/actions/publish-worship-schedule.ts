"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import type { WorshipSchedulePublicationActionState } from "@/features/worship-schedules/lib/publication-action-state"
import { prisma } from "@/lib/db/prisma"

async function publishWorshipSchedule(
  id: string,
  _previousState: WorshipSchedulePublicationActionState,
  _formData: FormData
): Promise<WorshipSchedulePublicationActionState> {
  await requirePermission("church.manage")

  const schedule = await prisma.worshipSchedule.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      isPublished: true,
      services: {
        select: {
          id: true,
          name: true,
          sortOrder: true,
          startsAt: true,
          churchLocation: {
            select: {
              name: true,
              isActive: true,
            },
          },
          assignments: {
            select: {
              id: true,
              sortOrder: true,
              worshipServiceRole: {
                select: {
                  name: true,
                  isActive: true,
                },
              },
            },
            orderBy: [
              {
                sortOrder: "asc",
              },
              {
                id: "asc",
              },
            ],
          },
        },
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            startsAt: "asc",
          },
        ],
      },
    },
  })

  if (!schedule) {
    return {
      status: "error",
      message: "Jadwal ibadah tidak ditemukan.",
    }
  }

  if (schedule.isPublished) {
    return {
      status: "success",
      message: "Jadwal ibadah sudah dipublikasikan.",
    }
  }

  if (schedule.services.length === 0) {
    return {
      status: "error",
      message: "Tambahkan minimal satu ibadah sebelum mempublikasikan jadwal.",
    }
  }

  const serviceWithInactiveLocation = schedule.services.find(
    (service) => !service.churchLocation.isActive
  )

  if (serviceWithInactiveLocation) {
    return {
      status: "error",
      message: `${serviceWithInactiveLocation.name} menggunakan lokasi ${serviceWithInactiveLocation.churchLocation.name} yang sudah nonaktif.`,
    }
  }

  const serviceWithoutAssignments = schedule.services.find(
    (service) => service.assignments.length === 0
  )

  if (serviceWithoutAssignments) {
    return {
      status: "error",
      message: `${serviceWithoutAssignments.name} belum memiliki petugas. Tambahkan minimal satu petugas sebelum publikasi.`,
    }
  }

  for (const service of schedule.services) {
    const inactiveAssignment = service.assignments.find(
      (assignment) => !assignment.worshipServiceRole.isActive
    )

    if (inactiveAssignment) {
      return {
        status: "error",
        message: `${service.name} masih menggunakan peran ${inactiveAssignment.worshipServiceRole.name} yang sudah nonaktif.`,
      }
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      for (const [serviceIndex, service] of schedule.services.entries()) {
        await tx.worshipService.update({
          where: {
            id: service.id,
          },
          data: {
            sortOrder: serviceIndex + 1,
          },
        })

        for (const [assignmentIndex, assignment] of service.assignments.entries()) {
          await tx.worshipServiceAssignment.update({
            where: {
              id: assignment.id,
            },
            data: {
              sortOrder: assignmentIndex + 1,
            },
          })
        }
      }

      await tx.worshipSchedule.update({
        where: {
          id,
        },
        data: {
          isPublished: true,
          publishedAt: new Date(),
        },
      })
    })
  } catch (error) {
    console.error("PUBLISH WORSHIP SCHEDULE FAILED", error)

    return {
      status: "error",
      message: "Jadwal ibadah gagal dipublikasikan. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/jadwal-ibadah")
  revalidatePath(`/admin/jadwal-ibadah/${id}`)

  updateTag(PUBLIC_CACHE_TAGS.worshipSchedules)

  revalidatePath("/")
  revalidatePath("/jadwal-ibadah", "layout")

  return {
    status: "success",
    message: "Jadwal ibadah berhasil dipublikasikan.",
  }
}

export { publishWorshipSchedule }
