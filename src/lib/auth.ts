import { createClient } from "@/lib/supabase/server";

// Função blindada que roda apenas no servidor para pegar o usuário
export async function getSessionUser() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) return null;
    return user;
  } catch (error) {
    return null;
  }
}