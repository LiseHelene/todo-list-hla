import { sql } from "@vercel/postgres";

// Créer la table si elle n'existe pas (appelé au démarrage)
export async function initDB() {
  await sql`
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
  `;
}

export async function getTaches() {
  const { rows } = await sql`
    SELECT * FROM taches ORDER BY terminee ASC, date_creation DESC
  `;
  return rows;
}

export async function createTache({ titre, avocat, priorite, deadline, description, email, createdBy }) {
  const { rows } = await sql`
    INSERT INTO taches (titre, avocat, priorite, deadline, description, email, created_by)
    VALUES (
      ${titre},
      ${avocat},
      ${priorite},
      ${deadline || null},
      ${description || null},
      ${email || null},
      ${createdBy || null}
    )
    RETURNING *
  `;
  return rows[0];
}

export async function toggleTache(id, terminee) {
  const { rows } = await sql`
    UPDATE taches SET terminee = ${terminee} WHERE id = ${id} RETURNING *
  `;
  return rows[0];
}

export async function deleteTache(id) {
  const { rows } = await sql`
    DELETE FROM taches WHERE id = ${id} RETURNING *
  `;
  return rows[0];
}

export async function setOutlookEventId(id, eventId) {
  await sql`UPDATE taches SET outlook_event_id = ${eventId} WHERE id = ${id}`;
}
