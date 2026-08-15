import { isValidGoogleDriveFileId } from "@/lib/google-drive"

type GoogleDriveMediaRouteProps = {
  params: Promise<{
    fileId: string
  }>
}

function createErrorResponse(message: string, status: number): Response {
  return Response.json(
    {
      error: message,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  )
}

export async function GET(request: Request, { params }: GoogleDriveMediaRouteProps) {
  const { fileId } = await params

  if (!isValidGoogleDriveFileId(fileId)) {
    return createErrorResponse("Google Drive file ID tidak valid.", 400)
  }

  const requestUrl = new URL(request.url)

  const resourceKey = requestUrl.searchParams.get("resourceKey")?.trim()

  const requestedWidth = requestUrl.searchParams.get("width")?.trim()

  const allowedWidths = new Set(["500", "750", "1000", "1200", "1600", "2000"])

  if (requestedWidth && !allowedWidths.has(requestedWidth)) {
    return createErrorResponse("Ukuran gambar Google Drive tidak valid.", 400)
  }

  const sourceWidth = requestedWidth ?? "2000"

  if (resourceKey && resourceKey.length > 500) {
    return createErrorResponse("Google Drive resource key tidak valid.", 400)
  }

  const upstreamUrl = new URL("https://drive.google.com/thumbnail")

  upstreamUrl.searchParams.set("id", fileId)
  upstreamUrl.searchParams.set("sz", `w${sourceWidth}`)

  if (resourceKey) {
    upstreamUrl.searchParams.set("resourcekey", resourceKey)
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
      },
      next: {
        revalidate: 86400,
      },
    })

    if (!upstreamResponse.ok) {
      console.error("GOOGLE DRIVE MEDIA UPSTREAM FAILED", upstreamResponse.status, fileId)

      return createErrorResponse(
        "Gambar Google Drive tidak dapat diakses.",
        upstreamResponse.status === 404 ? 404 : 502
      )
    }

    const contentType = upstreamResponse.headers.get("content-type")

    if (!contentType?.startsWith("image/")) {
      console.error("GOOGLE DRIVE MEDIA INVALID CONTENT TYPE", {
        fileId,
        status: upstreamResponse.status,
        contentType,
        finalUrl: upstreamResponse.url,
      })

      return createErrorResponse("Google Drive tidak mengembalikan data gambar.", 502)
    }

    return new Response(upstreamResponse.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error("GOOGLE DRIVE MEDIA FETCH FAILED", fileId, error)

    return createErrorResponse("Gambar Google Drive gagal dimuat.", 502)
  }
}
