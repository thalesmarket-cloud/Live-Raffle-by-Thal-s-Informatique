import React, { useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Upload, X, UserPlus, Trash2, RotateCcw, Users } from 'lucide-react';
import { Participant } from '@/src/types.ts';
import { cn } from '@/src/lib/utils.ts';
import { motion } from 'motion/react';

interface ImportPanelProps {
  onParticipantsImported: (participants: Participant[]) => void;
  participants: Participant[];
  onRemoveParticipant: (id: string) => void;
  onAddParticipant: (name: string) => void;
  onReset: () => void;
}

export const ImportPanel: React.FC<ImportPanelProps> = ({
  onParticipantsImported,
  participants,
  onRemoveParticipant,
  onAddParticipant,
  onReset
}) => {
  const [newName, setNewName] = React.useState('');
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    const file = 'target' in e ? (e.target as HTMLInputElement).files?.[0] : (e as React.DragEvent).dataTransfer?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json<any>(ws);

      const imported: Participant[] = data.map((row, index) => {
        // Handle First Name and Last Name combinations
        const firstName = row.Prénom || row.prenom || row.FirstName || row['First Name'] || '';
        const lastName = row.Nom || row.nom || row.LastName || row['Last Name'] || '';
        
        let name = '';
        if (firstName || lastName) {
          name = `${firstName} ${lastName}`.trim();
        } else {
          // Fallback to searching any name-like column
          name = row.Name || row.name || Object.values(row)[0];
        }

        const company = row.Entreprise || row.entreprise || row.Company || row.company || '';

        return {
          id: `imported-${index}-${Date.now()}`,
          name: String(name),
          email: row.Email || row.email || '',
          company: String(company)
        };
      }).filter(p => p.name && p.name !== 'undefined' && p.name !== '');

      onParticipantsImported(imported);
    };
    reader.readAsBinaryString(file);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAddParticipant(newName.trim());
      setNewName('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto p-6">
      {/* Left side: Upload & Add */}
      <div className="space-y-6">
        <div 
          className={cn(
            "relative group border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center gap-4",
            isDragging ? "border-blue-400 bg-blue-400/10" : "border-white/20 hover:border-white/40 bg-white/5"
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileUpload(e); }}
        >
          <input 
            type="file" 
            accept=".xlsx, .csv" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleFileUpload}
          />
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Upload className="text-blue-400" size={32} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Importer des participants</h3>
            <p className="text-sm opacity-60">Glissez-déposez un fichier Excel/CSV</p>
          </div>
          <div className="mt-2 text-xs opacity-40">Colonnes supportées: Prénom, Nom, Entreprise, Email</div>
        </div>

        <form onSubmit={handleAddSubmit} className="glass px-6 py-8 rounded-2xl space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <UserPlus size={18} className="text-green-400" />
            Ajout manuel
          </h3>
          <div className="space-y-4">
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nom du participant..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
            >
              Ajouter
            </button>
          </div>
        </form>

        <button 
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-4 border border-red-500/30 hover:bg-red-500/10 text-red-100 rounded-2xl transition-all"
        >
          <RotateCcw size={18} />
          Réinitialiser la liste
        </button>
      </div>

      {/* Right side: List Table */}
      <div className="lg:col-span-2 glass rounded-2xl overflow-hidden flex flex-col max-h-[600px]">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <Users size={18} className="text-blue-400" />
            Liste des participants ({participants.length})
          </h3>
        </div>
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-xs uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold opacity-60">Nom</th>
                <th className="px-6 py-4 font-semibold opacity-60">Entreprise</th>
                <th className="px-6 py-4 font-semibold opacity-60">Contact</th>
                <th className="px-6 py-4 font-semibold opacity-60 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {participants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center opacity-40 italic">
                    Aucun participant importé
                  </td>
                </tr>
              ) : (
                participants.map((p) => (
                  <motion.tr 
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium">{p.name}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-300">{p.company || '-'}</td>
                    <td className="px-6 py-4 text-sm opacity-60">{p.email || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onRemoveParticipant(p.id)}
                        className="p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-400/10 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
