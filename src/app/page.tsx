"use client"
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth()

  if(session?.user) {
    //redirecionar para pagina de upload
    redirect("/upload");
  }

  //redirecionar para pagina de login
  redirect("/login");
}
