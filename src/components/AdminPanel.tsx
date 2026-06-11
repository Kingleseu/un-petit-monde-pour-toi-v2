import { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { AppContent } from '../types';
import { X, Plus, Trash2, Save, Undo, Upload, Link, Copy, Check } from 'lucide-react';

const compressAndResizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compress to JPEG with 0.7 quality to keep it lightweight for localStorage
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

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
  const [copied, setCopied] = useState(false);

  const guestbookUrl = `${window.location.origin}/message`;

  const copyLink = () => {
    navigator.clipboard.writeText(guestbookUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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

          {/* Transitions */}
          <section>
            <h3 className="text-xl font-serif text-white mb-6 border-l-2 border-[#D4AF37] pl-4">Transitions entre les étapes</h3>
            <Textarea
              label="Phrases de transition (une phrase par ligne)"
              value={(formData.transitionMessages || []).join('\n')}
              onChange={(val: string) =>
                handleChange(
                  'transitionMessages',
                  val
                    .split('\n')
                    .map((line) => line.trim())
                    .filter(Boolean)
                )
              }
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
              {formData.galleryPhotos.map((photo, i) => {
                const isBase64 = photo.url.startsWith('data:');
                return (
                  <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl relative flex flex-col md:flex-row gap-4 items-start">
                    <div className="w-full md:w-32 h-32 bg-black/50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-white/10">
                      {photo.url ? <img src={photo.url} className="w-full h-full object-cover" alt="Preview"/> : <span className="text-xs text-white/30">Pas d'image</span>}
                    </div>
                    <div className="w-full flex-grow space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-[#D4AF37] mb-2">Image (Téléversement ou URL Web)</label>
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                          <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-dashed border-white/20 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 rounded-lg text-xs uppercase tracking-widest text-white/70 hover:text-[#D4AF37] transition-all w-full sm:w-auto shrink-0 select-none">
                            <Upload className="w-4 h-4" />
                            {photo.url ? "Changer" : "Choisir un fichier"}
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const base64 = await compressAndResizeImage(file);
                                    updateArrayItem('galleryPhotos', i, 'url', base64);
                                  } catch (err) {
                                    alert("Erreur lors du traitement de l'image");
                                    console.error(err);
                                  }
                                }
                              }}
                            />
                          </label>
                          
                          <div className="w-full flex items-center gap-2">
                            <input 
                              type="text" 
                              placeholder={isBase64 ? "Image locale importée" : "Ou coller une URL d'image web..."} 
                              value={isBase64 ? "Image locale (Base64)" : photo.url} 
                              disabled={isBase64}
                              onChange={(e) => updateArrayItem('galleryPhotos', i, 'url', e.target.value)}
                              className={`flex-grow bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-[#D4AF37] outline-none transition-colors w-full ${isBase64 ? 'opacity-60 cursor-not-allowed select-none font-mono text-xs' : ''}`} 
                            />
                            {photo.url && (
                              <button 
                                type="button"
                                onClick={() => updateArrayItem('galleryPhotos', i, 'url', '')} 
                                className="text-xs text-red-400 hover:text-red-300 font-bold uppercase tracking-wider px-2"
                                title="Effacer l'image"
                              >
                                Effacer
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Input label="Légende" value={photo.caption} onChange={(val: string) => updateArrayItem('galleryPhotos', i, 'caption', val)} />
                    </div>
                    <button onClick={() => removeArrayItem('galleryPhotos', i)} className="absolute top-4 right-4 text-white/30 hover:text-red-400 p-2 bg-black/50 rounded-full"><Trash2 className="w-4 h-4"/></button>
                  </div>
                );
              })}
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
            <div className="mt-4">
              <Input 
                label="Lien de la musique (URL YouTube ou lien direct MP3)" 
                value={formData.audioUrl || ''} 
                onChange={(val: string) => handleChange('audioUrl', val)} 
                placeholder="Ex: https://www.youtube.com/watch?v=y7e-GC6oGIZ ou https://example.com/musique.mp3"
              />
              <p className="text-white/40 text-xs mt-1">
                La musique démarrera automatiquement en arrière-plan une fois l'écran déverrouillé et continuera à jouer sur tout le site. Un bouton de volume flottant permettra également de couper le son.
              </p>
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

          {/* Guestbook Share Link */}
          <section>
            <h3 className="text-xl font-serif text-white mb-6 border-l-2 border-[#D4AF37] pl-4">❤️ Lien de partage — Mur des Proches</h3>
            <p className="text-white/50 text-sm mb-4 leading-relaxed">
              Partagez ce lien avec les proches qui souhaitent laisser un message sur le mur. Ils pourront l'écrire depuis leur téléphone ou ordinateur, sans accès au site principal.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2 overflow-hidden">
                <Link className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-white/70 text-sm truncate font-mono">{guestbookUrl}</span>
              </div>
              <button
                onClick={copyLink}
                className={`shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-widest transition-all ${
                  copied
                    ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                    : 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-[#050508] text-[#D4AF37]'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <p className="text-white/30 text-xs mt-3">
              💡 Conseil : envoyez ce lien par WhatsApp ou SMS à vos amis et famille quelques jours avant l'événement !
            </p>
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
