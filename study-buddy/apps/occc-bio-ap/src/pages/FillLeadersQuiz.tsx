import { Link } from 'react-router-dom';
import { p } from '../basePath';
import { ArrowLeft } from 'lucide-react';
import { FillLeadersPlate } from '../components/diagrams/FillLeadersPlate';
import { ANIMAL_CELL_LEADERS_PLATE } from '../data/animalCellLeaders';

export function FillLeadersQuiz() {
  return (
    <div className="space-y-6">
      <div>
        <Link to={p('/quizzes')} className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> Quizzes
        </Link>
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Exam 2 · test plate</p>
        <h1 className="page-title">{ANIMAL_CELL_LEADERS_PLATE.title}</h1>
        <p className="page-subtitle">
          Instructor cell figure. Names are covered; leaders stay. One submit grades every leader.
        </p>
      </div>
      <FillLeadersPlate />
    </div>
  );
}
