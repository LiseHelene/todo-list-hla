'use client';
import BannerFacturation  from '@/components/BannerFacturation';
import Header             from '@/components/Header';
import Stats              from '@/components/Stats';
import TaskForm           from '@/components/TaskForm';
import TaskList           from '@/components/TaskList';
import ImportCalendrier   from '@/components/ImportCalendrier';
import { useTaches }      from '@/hooks/useTaches';

export default function TodoApp({ session }) {
  const { taches, chargement, ajouterTache, toggleTerminee, supprimerTache, ajouterDepuisCalendrier, stats } = useTaches();

  return (
    <>
      <BannerFacturation />
      <div className="conteneur">
        <Header session={session} />
        <Stats stats={stats} />
        <TaskForm onAjouter={ajouterTache} />
        <ImportCalendrier onImporter={ajouterDepuisCalendrier} />
        {chargement ? (
          <p className="message-vide">Chargement des tâches…</p>
        ) : (
          <TaskList
            taches={taches}
            onToggle={toggleTerminee}
            onSupprimer={supprimerTache}
          />
        )}
      </div>
    </>
  );
}
