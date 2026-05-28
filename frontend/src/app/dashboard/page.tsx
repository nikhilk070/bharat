import { redirect } from "next/navigation";

export default function DashboardPage() {
  // In real app, you might check if questionnaire is submitted, then redirect accordingly
  redirect("/dashboard/overview");
}
