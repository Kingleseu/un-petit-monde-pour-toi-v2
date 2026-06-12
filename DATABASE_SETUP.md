# Configuration Supabase

Le projet peut maintenant sauvegarder le contenu du site et les messages dans une vraie base de donnees Supabase.

## 1. Creer la table

Dans Supabase, ouvre **SQL Editor**, colle le contenu de `supabase_messages.sql`, puis execute le script.

Le script cree ces tables :

- `site_settings` : textes principaux, musique, code d'acces, surprise.
- `guestbook_form` : textes du formulaire de temoignage.
- `capsule_cards` : cartes de la capsule.
- `gallery_photos` : photos et legendes.
- `letter_parts` : paragraphes de la lettre.
- `friend_messages` : messages fixes du mur des proches.
- `default_words` : mots par defaut du coeur.
- `transition_messages` : phrases entre les etapes.
- `messages` : messages envoyes par les visiteurs.
- `gallery-images` : bucket Supabase Storage public pour les photos importees depuis l'admin.

## 2. Ajouter les variables d'environnement

Dans Vercel, ajoute ces variables dans **Project Settings > Environment Variables** :

```env
SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
SUPABASE_MESSAGES_TABLE="messages"
SUPABASE_GALLERY_BUCKET="gallery-images"
```

La cle `SUPABASE_SERVICE_ROLE_KEY` doit rester cote serveur. Ne l'ajoute jamais avec un prefixe `VITE_`.

## 3. Redeployer

Redeploie le site apres avoir ajoute les variables.

Sans ces variables, le projet continue a utiliser le contenu par defaut et `messages.json` en local.
