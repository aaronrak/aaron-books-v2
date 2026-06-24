import { Download, FileArchive, ArrowLeft } from "lucide-react";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileArchive className="h-8 w-8 text-emerald-800" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Fichiers du projet
        </h1>
        <p className="text-slate-600 mb-8">
          Téléchargez l'archive ZIP contenant tous les fichiers source du projet.
        </p>
        
        <a
          href="/project-files.zip"
          download="project-files.zip"
          className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold px-8 py-4 rounded-xl transition-colors w-full justify-center"
        >
          <Download className="h-5 w-5" />
          Télécharger le ZIP
        </a>
        
        <p className="text-xs text-slate-400 mt-4">
          Taille: ~150 Ko
        </p>
        
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mt-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}
