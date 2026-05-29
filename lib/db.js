import { createClient } from '@supabase/supabase-js';

// Initialiser le client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Créer la table si elle n'existe pas (appelé au démarrage)
export async function initDB() {
  const { error } = await supabase
    .from('taches')
    .select('*')
    .limit(0);
  
  // Si la table n'existe pas, la créer via SQL
  if (error?.code === 'PGRST116') {
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS taches (
          id            BIGSERIAL PRIMARY KEY,
          titre         VARCHAR(500)  NOT NULL,
          avocat        VARCHAR(200)  NOT NULL,
          priorite      VARCHAR(20)   NOT NULL DEFAULT 'normale',
          deadline      DATE,
          description   TEXT,
          email         VARCHAR(200),
          terminee      BOOLEAN       NOT NULL DEFAULT FALSE,
          date_creation TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
          outlook_event_id TEXT,
          created_by    VARCHAR(200)
        )
      `
    });
    if (createError) throw createError;
  }
}

export async function getTaches() {
  const { data, error } = await supabase
    .from('taches')
    .select('*')
    .order('terminee', { ascending: true })
    .order('date_creation', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createTache({ titre, avocat, priorite, deadline, description, email, createdBy }) {
  const { data, error } = await supabase
    .from('taches')
    .insert([{
      titre,
      avocat,
      priorite,
      deadline: deadline || null,
      description: description || null,
      email: email || null,
      created_by: createdBy || null
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function toggleTache(id, terminee) {
  const { data, error } = await supabase
    .from('taches')
    .update({ terminee })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteTache(id) {
  const { data, error } = await supabase
    .from('taches')
    .delete()
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function setOutlookEventId(id, eventId) {
  const { error } = await supabase
    .from('taches')
    .update({ outlook_event_id: eventId })
    .eq('id', id);
  
  if (error) throw error;
}
