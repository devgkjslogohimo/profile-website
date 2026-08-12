"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { ToggleUserActionState } from "@/features/users/lib/toggle-user-action-state"
import { hasPermission } from "@/lib/auth/permissions"
import { prisma } from "@/lib/db/prisma"

function isWriteConflict(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2034"
}

async function toggleUser(id: string, nextIsActive: boolean): Promise<ToggleUserActionState> {
  const currentUser = await requirePermission("users.manage")

  if (typeof nextIsActive !== "boolean") {
    return {
      status: "error",
      message: "Status pengguna tidak valid.",
    }
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        /*
         * Permission sudah diperiksa oleh requirePermission(), tetapi
         * diperiksa kembali di dalam transaction agar actor tidak dapat
         * melanjutkan operasi jika status/role-nya berubah bersamaan.
         */
        const actor = await tx.user.findUnique({
          where: {
            id: currentUser.id,
          },
          select: {
            id: true,
            role: true,
            isActive: true,
          },
        })

        if (!actor || !actor.isActive || !hasPermission(actor.role, "users.manage")) {
          return {
            status: "error" as const,
            message: "Akses untuk mengelola pengguna sudah tidak berlaku.",
            changed: false,
          }
        }

        const targetUser = await tx.user.findUnique({
          where: {
            id,
          },
          select: {
            id: true,
            name: true,
            role: true,
            isActive: true,
          },
        })

        if (!targetUser) {
          return {
            status: "error" as const,
            message: "Pengguna tidak ditemukan.",
            changed: false,
          }
        }

        /*
         * Akun yang sedang digunakan tidak boleh menonaktifkan dirinya
         * sendiri. Guard UI saja tidak cukup, jadi tetap wajib di server.
         */
        if (targetUser.id === actor.id && !nextIsActive) {
          return {
            status: "error" as const,
            message: "Akun yang sedang digunakan tidak dapat dinonaktifkan.",
            changed: false,
          }
        }

        if (targetUser.isActive === nextIsActive) {
          return {
            status: "success" as const,
            message: nextIsActive
              ? `${targetUser.name} sudah dalam status aktif.`
              : `${targetUser.name} sudah dalam status nonaktif.`,
            changed: false,
          }
        }

        /*
         * Pertahankan minimal satu Super Admin aktif.
         */
        if (!nextIsActive && targetUser.role === "SUPER_ADMIN") {
          const otherActiveSuperAdminCount = await tx.user.count({
            where: {
              id: {
                not: targetUser.id,
              },
              role: "SUPER_ADMIN",
              isActive: true,
            },
          })

          if (otherActiveSuperAdminCount === 0) {
            return {
              status: "error" as const,
              message:
                "Pengguna tidak dapat dinonaktifkan karena sistem harus memiliki minimal satu Super Admin aktif.",
              changed: false,
            }
          }
        }

        await tx.user.update({
          where: {
            id: targetUser.id,
          },
          data: nextIsActive
            ? {
                isActive: true,
              }
            : {
                isActive: false,

                /*
                 * Cabut seluruh sesi lama.
                 *
                 * Cookie/session lama masih menyimpan sessionVersion lama,
                 * sehingga DAL akan menolaknya pada request berikutnya.
                 */
                sessionVersion: {
                  increment: 1,
                },
              },
        })

        return {
          status: "success" as const,
          message: nextIsActive
            ? `${targetUser.name} berhasil diaktifkan.`
            : `${targetUser.name} berhasil dinonaktifkan dan sesi lamanya telah dicabut.`,
          changed: true,
        }
      },
      {
        isolationLevel: "Serializable",
      }
    )

    if (result.changed) {
      revalidatePath("/admin/pengguna")
      revalidatePath(`/admin/pengguna/${id}/edit`)
    }

    return {
      status: result.status,
      message: result.message,
    }
  } catch (error) {
    if (isWriteConflict(error)) {
      return {
        status: "error",
        message: "Status pengguna berubah pada waktu yang sama. Silakan coba kembali.",
      }
    }

    console.error("TOGGLE USER STATUS FAILED", error)

    return {
      status: "error",
      message: "Status pengguna gagal diperbarui. Silakan coba kembali.",
    }
  }
}

export { toggleUser }
