# Guide d'intégration Supabase

## 🚀 Configuration rapide

### 1. Créer un projet Supabase
1. Accédez à [app.supabase.com](https://app.supabase.com)
2. Créez un nouveau projet
3. Notez votre **Project URL** et **Anon Key**

### 2. Variables d'environnement
Copiez `.env.local.example` en `.env.local` et complétez :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role
```

### 3. Créer la table `users`
Dans Supabase SQL Editor, exécutez :

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  azure_id TEXT,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_azure_id ON users(azure_id);
```

### 4. Créer la table `todos` (exemple)
```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_todos_user_id ON todos(user_id);
```

## 📝 Utilisation en composants

### Client-side (Browser)
```javascript
import { createClientSupabase } from '@/lib/supabase';

export default function MyComponent() {
  const supabase = createClientSupabase();
  
  // Récupérer les données
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId);
}
```

### Server-side (API routes / Server Components)
```javascript
import { createServerSupabase } from '@/lib/supabase';

export async function GET(req) {
  const supabase = createServerSupabase();
  
  const { data, error } = await supabase
    .from('users')
    .select('*');
}
```

## 🔐 Sécurité - Row Level Security (RLS)

Activez RLS sur vos tables dans Supabase :

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Utilisateur peut voir son profil
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

-- Utilisateur peut voir ses todos
CREATE POLICY "Users can view own todos"
  ON todos FOR SELECT
  USING (auth.uid()::text = user_id::text);
```

## 🔄 Synchronisation avec Azure AD

L'authentification avec Azure AD synchronise automatiquement l'utilisateur dans Supabase via le callback JWT dans `auth.js`.

## 📚 Ressources
- [Documentation Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [NextAuth.js Documentation](https://next-auth.js.org)
