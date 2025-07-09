import { Alert, AlertDescription } from "@/components/ui/alert"
import { ZapIcon } from "lucide-react"

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null
  
  return (
    <Alert variant="destructive" className="mb-4">
      <ZapIcon className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}