'use client';
import BannerFacturation from '@/components/BannerFacturation';
import Header            from '@/components/Header';
import Stats             from '@/components/Stats';
import TaskForm          from '@/components/TaskForm';
import TaskList          from '@/components/TaskList';
import { useTaches }     from '@/hooks/useTaches';

export default function Page() {
  const { taches, ajouterTache, toggleTerminee, supprimerTache, stats } = useTaches();

  return (
    <>
      <BannerFacturation />
      <div className="conteneur">
        <Header />
        <Stats stats={stats} />
        <TaskForm onAjouter={ajouterTache} />
        <TaskList
          taches={taches}
          onToggle={toggleTerminee}
          onSupprimer={supprimerTache}
        />
      </div>
    </>
  );
}
