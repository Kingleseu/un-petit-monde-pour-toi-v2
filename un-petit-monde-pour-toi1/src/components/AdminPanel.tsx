import { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { AppContent } from '../types';
import { X, Plus, Trash2, Save, Undo } from 'lucide-react';

const Input = ({ label, value, onChange, type = "text", placeholder = "" }: any) => (
  <div className="mb-4">
    <label className="block text-xs uppercase tracking-widest text-[#D4AF37] mb-2">{label}</label>
    <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none transition-colors" />
  </div>
);

const Textarea = ({ label, value, onChange }: any) => (
  <div className="mb-4">
    <label className="block text-xs uppercase tracking-widest text-[#D4AF37] mb-2">{label}</label>
    <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] outline-none transition-colors h-24" />
  </div>
);

export function AdminPanel({ onClose }: { onClose: () => void }) {
  const { content, updateContent, resetContent } = useContent();
  const [formData, setFormData] = useState<AppContent>(content);

  const handleChange = (field: keyof AppContent, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateContent(formData);
    onClose();
  };

  const handleReset = () => {
    if (confirm("Réinitialiser avec le contenu par défaut ? Touts vos changements seront perdus.")) {
      resetContent();
      onClose();
    }
  };

  const updateArrayItem = (field: keyof AppContent, index: number, itemField: string, value: string) => {
    const list = [...(formData[field] as any[])];
    list[index][itemField] = value;
    handleChange(field, list);
  };

  const updateStringArrayItem = (field: keyof AppContent, index: number, value: string) => {
    const list = [...(formData[field] as string[])];
    list[index] = value;
    handleChange(field, list);
  };

  const removeArrayItem = (field: keyof AppContent, index: number) => {
    const list = [...(formData[field] as any[])];
    list.splice(index, 1);
    handleChange(field, list);
  };

  const addArrayItem = (field: keyof AppContent, emptyItem: any) => {
    const list = [...(formData[field] as any[]), emptyItem];
    handleChange(field, list);
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#050508]/95 backdrop-blur-md text-white overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-[#050508] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-10 mb-20 relative">
        <div className="sticky top-0 bg-[#050508] z-10 pt-2 pb-6 border-b border-white/10 mb-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h2 className="text-3xl font-serif tracking-wide text-[#D4AF37]">Configuration</h2>
            <p className="text-white/50 text-sm mt-1">Modifiez le contenu de l'expérience et sauvegardez.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-white/40 rounded-full hover:bg-white/5 text-xs uppercase tracking-widest transition-colors">
              <Undo className="w-4 h-4"/> <span className="hidden md:inline">Par défaut</span>
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-[#D4AF37] text-[#050508] rounded-full hover:bg-[#D4AF37]/90 text-xs uppercase font-bold tracking-widest transition-colors shadow-lg shadow-[#D4AF37]/20">
              <Save className="w-4 h-4"/> Enregistrer
            </button>
            <button onClick={onClose} className="p-2 border border-white/20 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5"/>
            </button>
          </div>
        </div>
        
        <div className="space-y-16">
          
          {/* Global & Lock */}
          <section>
            <h3 className="text-xl font-serif text-white mb-6 border-l-2 border-[#D4AF37] pl-4">🔑 Sécurité (Étape 0)</h3>
            <Input 
              label="Code d'accès (4 chiffres)" 
              value={formData.unlockCode} 
              onChange={(val: string) => handleChange('unlockCode', val.slice(0, 4).replace(/[^0-9]/g, ''))} 
              placeholder="Ex: 1234 (Laissez vide pour accepter tout code)" 
            />
          </section>

          {/* Intro */}
          <section>
            <h3 className="text-xl font-serif text-white mb-6 border-l-2 border-[#D4AF37] pl-4">👋 Introduction (Étape 1)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Prénom du destinataire" value={formData.recipientName} onChange={(val: string) => handleChange('recipientName', val)} />
              <Input label="Accroche Principale" value={formData.introText1} onChange={(val: string) => handleChange('introText1', val)} />
            </div>
            <Textarea label="Introduction (Paragraphe 1)" value={formData.introText2} onChange={(val: string) => handleChange('introText2', val)} />
            <Textarea label="Introduction (Paragraphe 2)" value={formData.introText3} onChange={(val: string) => handleChange('introText3', val)} />
          </section>

          {/* Capsule */}
          <section>
            <h3 className="text-xl font-serif text-white mb-6 border-l-2 border-[#D4AF37] pl-4">✨ La Capsule (Étape 2)</h3>
            <p className="text-white/40 text-sm mb-4">Ces cartes se retournent au clic.</p>
            <div className="space-y-4">
              {formData.capsuleCards.map((card, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl relative">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <Input label={`Titre de la carte ${i+1}`} value={card.title} onChange={(val: string) => updateArrayItem('capsuleCards', i, 'title', val)} />
                    </div>
                    <div className="md:col-span-2">
                      <Textarea label="Contenu au dos" value={card.content} onChange={(val: string) => updateArrayItem('capsuleCards', i, 'content', val)} />
                    </div>
                  </div>
                  <button onClick={() => removeArrayItem('capsuleCards', i)} className="absolute top-4 right-4 text-white/30 hover:text-red-400"><Trash2 className="w-5 h-5"/></button>
                </div>
              ))}
              <button 
                onClick={() => addArrayItem('capsuleCards', { title: "Nouveau titre", content: "Nouveau contenu" })} 
                className="w-full py-4 border border-dashed border-white/20 rounded-xl hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-white/50 hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
              >
                <Plus className="w-4 h-4"/> Ajouter une carte
              </button>
            </div>
          </section>

          {/* Gallery */}
          <section>
            <h3 className="text-xl font-serif text-white mb-6 border-l-2 border-[#D4AF37] pl-4">🖼️ Galerie Photos (Étape 3)</h3>
            <div className="space-y-4">
              {formData.galleryPhotos.map((photo, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl relative flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-full md:w-32 h-32 bg-black/50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-white/10">
                    {photo.url ? <img src={photo.url} className="w-full h-full object-cover" alt="Preview"/> : <span className="text-xs text-white/30">Pas d'image</span>}
                  </div>
                  <div className="w-full flex-grow">
                    <Input label="URL de l'image (Lien public)" value={photo.url} onChange={(val: string) => updateArrayItem('galleryPhotos', i, 'url', val)} />
                    <Input label="Légende" value={photo.caption} onChange={(val: string) => updateArrayItem('galleryPhotos', i, 'caption', val)} />
                  </div>
                  <button onClick={() => removeArrayItem('galleryPhotos', i)} className="absolute top-4 right-4 text-white/30 hover:text-red-400 p-2 bg-black/50 rounded-full"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
              <button 
                onClick={() => addArrayItem('galleryPhotos', { url: "", caption: "" })} 
                className="w-full py-4 border border-dashed border-white/20 rounded-xl hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-white/50 hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
              >
                <Plus className="w-4 h-4"/> Ajouter une photo
              </button>
            </div>
          </section>

          {/* Playlist */}
          <section>
            <h3 className="text-xl font-serif text-white mb-6 border-l-2 border-[#D4AF37] pl-4">🎵 Playlist (Étape 4)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Titre de la chanson" value={formData.playlistTitle} onChange={(val: string) => handleChange('playlistTitle', val)} />
              <Input label="Durée (faux indicateur)" value={formData.playlistSubtitle} onChange={(val: string) => handleChange('playlistSubtitle', val)} />
            </div>
          </section>

          {/* Letter */}
          <section>
            <h3 className="text-xl font-serif text-white mb-6 border-l-2 border-[#D4AF37] pl-4">✉️ La Lettre Interactive (Étape 5)</h3>
            <p className="text-white/40 text-sm mb-4">Chaque ligne est un paragraphe révélé l'un après l'autre.</p>
            <div className="space-y-4">
              {formData.letterParts.map((part, i) => (
                <div key={i} className="relative">
                  <Textarea label={`Paragraphe ${i+1}`} value={part} onChange={(val: string) => updateStringArrayItem('letterParts', i, val)} />
                  <button onClick={() => removeArrayItem('letterParts', i)} className="absolute top-0 right-0 p-3 mt-1 mr-1 text-white/30 hover:text-red-400"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
              <button 
                onClick={() => addArrayItem('letterParts', "")} 
                className="w-full py-4 border border-dashed border-white/20 rounded-xl hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-white/50 hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
              >
                <Plus className="w-4 h-4"/> Ajouter un paragraphe
              </button>
            </div>
          </section>

          {/* Messages */}
          <section>
            <h3 className="text-xl font-serif text-white mb-6 border-l-2 border-[#D4AF37] pl-4">❤️ Le Mur des Proches (Étape 6)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {formData.friendMessages.map((msg, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl relative">
                  <Textarea label="Message" value={msg.text} onChange={(val: string) => updateArrayItem('friendMessages', i, 'text', val)} />
                  <Input label="Auteur / Signataire" value={msg.author} onChange={(val: string) => updateArrayItem('friendMessages', i, 'author', val)} />
                  <button onClick={() => removeArrayItem('friendMessages', i)} className="absolute top-4 right-4 text-white/30 hover:text-red-400"><Trash2 className="w-5 h-5"/></button>
                </div>
              ))}
            </div>
            <button 
              onClick={() => addArrayItem('friendMessages', { text: "", author: "" })} 
              className="mt-4 w-full py-4 border border-dashed border-white/20 rounded-xl hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-white/50 hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
            >
              <Plus className="w-4 h-4"/> Ajouter un message
            </button>
          </section>

          {/* Surprise */}
          <section>
            <h3 className="text-xl font-serif text-white mb-6 border-l-2 border-[#D4AF37] pl-4">🎁 Surprise Finale (Étape 7)</h3>
            <Textarea label="Titre Principal" value={formData.surpriseTitle} onChange={(val: string) => handleChange('surpriseTitle', val)} />
            <Input label="Sous-titre" value={formData.surpriseSubtitle} onChange={(val: string) => handleChange('surpriseSubtitle', val)} />
            <Textarea label="Message de conclusion" value={formData.surpriseText} onChange={(val: string) => handleChange('surpriseText', val)} />
          </section>

        </div>
      </div>
    </div>
  );
}
