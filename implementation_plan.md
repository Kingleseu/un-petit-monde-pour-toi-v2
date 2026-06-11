# Refonte Complète — "Un Petit Monde Pour Toi" ✨

## Vision

Transformer le site d'un formulaire configuré en une **vraie expérience sensorielle et émotionnelle** : chaque étape a sa propre ambiance, ses propres couleurs, ses propres émotions. La personne ne navigue pas — elle **vit** quelque chose.

---

## User Review Required

> [!IMPORTANT]
> Ce plan touche à **toutes les étapes** et implique une refonte visuelle majeure. Le site actuel continuera à fonctionner pendant les travaux.

> [!NOTE]
> Les nouvelles fonctionnalités demandées + des surprises supplémentaires sont incluses dans ce plan pour rendre l'expérience vraiment unique.

---

## 1. Design System & Fond Atmosphérique

### [MODIFY] [index.css](file:///c:/Users/ebenn/Downloads/un-petit-monde-pour-toi/src/index.css)
- Importer les polices **Cormorant Garamond** (ultra-romantique, serif) + **DM Sans** (propre, moderne) depuis Google Fonts
- Ajouter des classes utilitaires : `text-shadow-glow`, `glass-card`, `shimmer`
- Ajouter des animations CSS : `@keyframes pulse-rose`, `@keyframes float`, `@keyframes shimmer`

### [MODIFY] [Background.tsx](file:///c:/Users/ebenn/Downloads/un-petit-monde-pour-toi/src/components/Background.tsx)
- Remplacer le fond statique par un fond **dynamique par étape** (couleur et ambiance changeantes)
- **Étape 0 (Lock)** : Violet profond + étoiles froides, ambiance mystère
- **Étape 1 (Intro)** : Bleu nuit → violet doux, particules nacrées
- **Étape 2 (Capsule)** : Or chaud, léger brouillard doré
- **Étape 3 (Galerie)** : Rose vieux + bordeaux, chaleureux
- **Étape 4 (Playlist)** : Cercles concentriques musicaux pulsants en violet
- **Étape 5 (Lettre)** : Ivoire lumineux, comme une bougie
- **Étape 6 (Messages)** : Rose corail + or, festif mais doux
- **Étape 7 (Surprise)** : Confettis or explosant depuis le centre
- Petites **lucioles** flottantes (remplacent les points statiques)
- Fond dégradé qui respire lentement (scale 1→1.05→1)

---

## 2. Navigation — Barre de Progression Chapitre

### [NEW] [src/components/ChapterNav.tsx](file:///c:/Users/ebenn/Downloads/un-petit-monde-pour-toi/src/components/ChapterNav.tsx)
- Barre élégante en bas de l'écran
- Icônes de chapitres : 🔒 📖 ✨ 🖼️ 🎵 💌 ❤️ 🎁
- Chaque chapitre s'allume en or quand il est complété
- Visible uniquement à partir de l'étape 1 (pas sur l'écran de verrouillage)
- Tooltip au survol avec le titre de l'étape

---

## 3. Étape 0 — Porte d'Entrée (Lock)

### [MODIFY] [Step0_Lock.tsx](file:///c:/Users/ebenn/Downloads/un-petit-monde-pour-toi/src/components/steps/Step0_Lock.tsx)
- **Texte d'accueil poétique** qui apparaît mot par mot (typewriter doux) avant le clavier
- Animation de **déverrouillage cinématique** : le verrou explose en particules d'or
- Fond : lune et étoiles animées
- **Bouton alternatif** : si `unlockCode` est vide, afficher directement un bouton "Ouvrir mon cadeau 🎁" au lieu du clavier numérique

---

## 4. Étape 1 — Introduction

### [MODIFY] [Step1_Intro.tsx](file:///c:/Users/ebenn/Downloads/un-petit-monde-pour-toi/src/components/steps/Step1_Intro.tsx)
- Texte d'intro **révélé progressivement** (typewriter) mot par mot avec un délai poétique
- **Nom du destinataire** en grand, brillant, avec une légère lueur rose-or autour
- **Indicateur de chapitres** (7 étapes à découvrir) affiché en bas de façon élégante
- Bouton "Ouvrir le coffre" avec animation : **s'ouvre** visuellement, effet serrure cliquée

---

## 5. Étape 2 — Capsule "Toi"

### [MODIFY] [Step2_Capsule.tsx](file:///c:/Users/ebenn/Downloads/un-petit-monde-pour-toi/src/components/steps/Step2_Capsule.tsx)
- Cartes avec **effet de lueur colorée unique** selon le thème de chaque carte
- Côté avant : **icône thématique animée** (✨ pour amour, 📷 pour souvenir, etc.)
- Côté arrière : texte en italique sur fond de parchemin légèrement texturé
- Quand toutes les cartes sont retournées : **confettis légers** + message "Tu mérites d'entendre tout ça ❤️"

---

## 6. Étape 3 — Galerie Souvenir

### [MODIFY] [Step3_Gallery.tsx](file:///c:/Users/ebenn/Downloads/un-petit-monde-pour-toi/src/components/steps/Step3_Gallery.tsx)
- **Effet Polaroid amélioré** : grain photo subtil, ombre portée réaliste, petite marque de crayon simulée
- **Lightbox modale** : clic sur photo → plein écran avec fond noir velouté + caption centrée
- **Transition de défilement** : effet Ken Burns (zoom lent) en mode plein écran
- Légende visible comme un vrai titre manuscrit en dessous de chaque photo

---

## 7. Étape 4 — Playlist

### [MODIFY] [Step4_Playlist.tsx](file:///c:/Users/ebenn/Downloads/un-petit-monde-pour-toi/src/components/steps/Step4_Playlist.tsx)
- **Visualiseur audio** : barres animées qui bougent (simulées) quand la musique joue
- Vinyle rotatif en 3D avec reflet brillant
- **Texte poétique déroulant** derrière le lecteur (des paroles inventées ou le texte de l'admin)
- La musique doit commencer avec un **fade-in doux** (volume 0 → volume cible)

---

## 8. Étape 5 — La Lettre Interactive

### [MODIFY] [Step5_Letter.tsx](file:///c:/Users/ebenn/Downloads/un-petit-monde-pour-toi/src/components/steps/Step5_Letter.tsx)
- **Fond parchemin** : carte avec texture légère, ombre de bougie simulée
- Les parties de lettre apparaissent avec un **effet machine à écrire** (lettre par lettre)
- **Bouton "continuer"** remplacé par un ruban de soie qui se dénoue visuellement
- Fin de lettre : signature stylisée animée (tracée à la plume)

---

## 9. Étape 6 — Mur des Messages & Cœur

### [MODIFY] [Step6_Messages.tsx](file:///c:/Users/ebenn/Downloads/un-petit-monde-pour-toi/src/components/steps/Step6_Messages.tsx)
- Cards de messages avec bordure colorée unique par carte (palette de couleurs douces)
- **Réaction emoji** : sous chaque carte, petits emojis "❤️ 🥹 ✨" cliquables (juste visuels)
- Le **Cœur de Mots** existant enrichi : couleur dégradée or-rose pour les mots des proches (en doré) vs. mots par défaut (en blanc/transparent)
- Animation d'entrée des mots : ils **tombent doucement** en place depuis le haut

---

## 10. Étape 7 — La Surprise Finale

### [MODIFY] [Step7_Surprise.tsx](file:///c:/Users/ebenn/Downloads/un-petit-monde-pour-toi/src/components/steps/Step7_Surprise.tsx)
- **Explosion de confettis colorés** (or, rose, blanc) depuis le centre quand l'enveloppe est ouverte
- Le cadeau : **enveloppe animée** qui s'ouvre avec une lettre qui en sort
- **Option "Toujours revenir ici"** : bouton "Sauvegarder ce site" avec instruction de mettre en favori
- **Compteur poétique** : "Ton anniversaire, il y a X jours" ou "Tu mérites d'être célébré(e) 365 jours par an"

---

## 11. Améliorations Globales

### [NEW] [src/components/ProgressBar.tsx](file:///c:/Users/ebenn/Downloads/un-petit-monde-pour-toi/src/components/ProgressBar.tsx)
- Barre de progression dorée fine en haut de l'écran (style reading progress)
- Se remplit de 0% à 100% au fil des étapes

### [NEW] [src/components/TransitionScreen.tsx](file:///c:/Users/ebenn/Downloads/un-petit-monde-pour-toi/src/components/TransitionScreen.tsx)
- Entre chaque étape, un flash de transition ultra-court avec un texte poétique ("Le chapitre suivant s'ouvre...")

### [MODIFY] [App.tsx](file:///c:/Users/ebenn/Downloads/un-petit-monde-pour-toi/src/App.tsx)
- Intégrer `ChapterNav`, `ProgressBar`, et `TransitionScreen`
- Transmettre le `step` actuel à `Background` pour les ambiances par étape

---

## Vérification & Tests

### Compilation
```bash
npm run lint
npm run build
```

### Tests manuels
1. Parcourir toutes les étapes 0→7 et vérifier les transitions, animations, et ambiances
2. Tester la soumission via `/message` et voir le mot apparaître dans le cœur
3. Vérifier la responsivité mobile (iPhone, Android)
4. Vérifier que le son joue et que le bouton mute/unmute fonctionne
