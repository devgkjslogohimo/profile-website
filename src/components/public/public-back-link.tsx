import Link from "next/link"
import { FiArrowLeft } from "react-icons/fi"

import { buttonVariants } from "@/components/ui/button"

type PublicBackLinkProps = {
  href: string
  label: string
}

function PublicBackLink({ href, label }: PublicBackLinkProps) {
  return (
    <Link
      href={href}
      className={buttonVariants({
        variant: "ghost",
        size: "sm",
      })}
    >
      <FiArrowLeft aria-hidden="true" className="size-4" />
      {label}
    </Link>
  )
}

export { PublicBackLink }
