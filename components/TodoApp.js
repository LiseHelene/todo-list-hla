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
      <div className="page">
        <Header session={session} />
        <Stats stats={stats} />
        <TaskForm onAjouter={ajouterTache} />
        <ImportCalendrier onImporter={ajouterDepuisCalendrier} />
        <div className="section-label">
          <span className="label">Tâches du cabinet</span>
          <span className="rule"></span>
        </div>
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
