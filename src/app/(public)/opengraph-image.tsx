import {
  createPublicSocialImageResponse,
  PUBLIC_SOCIAL_IMAGE_SIZE,
} from "@/features/public-site/lib/public-social-image"

export const alt = "GKJ Slogohimo — Website Resmi"

export const size = PUBLIC_SOCIAL_IMAGE_SIZE

export const contentType = "image/png"

async function OpenGraphImage() {
  return createPublicSocialImageResponse()
}

export default OpenGraphImage
