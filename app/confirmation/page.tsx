import { Suspense } from "react"
import { ConfirmationContent } from "./confirmation-content"

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
