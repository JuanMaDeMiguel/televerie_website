# Televerie - Frontend Web

Projet réalisé dans le cadre du module CAI (Semestre S9) à l'École Nationale d'Ingénieurs de Brest (ENIB).

## 📖 Contexte du Projet
La société prestataire en charge des équipements de laverie des résidences CROUS de Brest nous a contacté pour résoudre un problème d'organisation majeur. Actuellement, il y a tout simplement trop de monde pour le nombre de machines disponibles. Cette situation crée inévitablement de gros pics de demande, génère de la frustration, fait perdre trop de temps aux résidents et provoque parfois des conflits entre voisins.

L'objectif du projet "Televerie" est de transformer ce service en permettant aux utilisateurs d'organiser leur lessive de manière prévisible, avec la garantie absolue qu'une machine sera bien disponible et réservée pour eux à leur arrivée.

## 🎯 Public Cible (Personas)
Le développement de l'interface est pensé pour répondre aux besoins spécifiques et aux frustrations des résidents :
* **L'étudiante active (ex: Amina) :** Avec un emploi du temps millimétré, elle ne peut pas se permettre de perdre une heure à attendre une machine libre et a besoin de minimiser les temps d'attente inutiles.
* **L'étudiant "Road-trip" (ex: Dimitri) :** Rentre souvent le dimanche soir épuisé avec une montagne de vêtements et a besoin de visibilité pour éviter de faire des allers-retours inutiles dans les étages.

## 🚀 Fonctionnalités Clés
L'application propose une interface Mobile-First centralisée autour de quatre axes :
1.  **Dashboard (Accueil) :** Permet de consulter l'état et la disponibilité des machines en temps réel.
2.  **Système de Réservation :** Permet de réserver un créneau pour une machine spécifique à l'avance et de payer sa session de manière dématérialisée.
3.  **Score de Crédit (Classement) :** Le système intègre un score de fiabilité récompensant les bonnes pratiques, afin d'accorder une priorité de réservation aux utilisateurs faisant un usage correct du service.
4.  **Profil Utilisateur :** Regroupe les informations personnelles, les moyens de paiement, l'historique des réservations et les notifications.

## 🛠️ Stack Technique
* **Approche :** Développement Mobile-First basé sur les prototypes haute fidélité.
* **Frontend :** HTML5, CSS3 (Vanilla), JavaScript.

## 📋 Backlog de Développement Frontend

**Phase 1 : Configuration et Planification**
* Initialiser le dépôt GitHub. Juan Marcos DE MIGUEL
* Mettre en place l'arborescence des dossiers (`/css`, `/js`, `img`, etc.). Juan Marcos DE MIGUEL
* Rédiger le cahier des charges et intégrer ce backlog dans le gestionnaire de tâches. Julian Andres RAYES CANO

**Phase 2 : Structure Globale et UI de base**
* Créer le squelette HTML5 principal (Layout de base). Julian Andres RAYES CANO
* Configurer le fichier CSS avec les variables globales (couleurs, typographies, bordures) extraites du prototype. Juan Cruz BAUDINO CASAIS
* Intégrer et styliser la barre de navigation inférieure (Bottom Navigation Bar) pour lier les 4 vues principales.Juan Marcos DE MIGUEL

**Phase 3 : Intégration de l'écran "Accueil"**
* Intégrer l'en-tête dynamique (Message de bienvenue + sélection de la laverie). Facundo ARITO
* Concevoir la grille de cartes pour l'état des machines. Julian Andres RAYES CANO
* Définir les classes CSS pour les 4 états : Libre, En cours, Réservée et Hors-ligne. Julian Andres RAYES CANO
* Implémenter la logique JavaScript pour le chronomètre circulaire des machines "En cours". Facundo ARITO
* Concevoir la fenêtre de "Réserver un Créneau". Julian RAYES et Facundo ARITO

**Phase 4 : Intégration de l'écran "Réservations"**
* Intégrer la carte supérieure affichant le prochain tour de l'utilisateur avec un compte à rebours.
* Développer le composant visuel du calendrier interactif.
* Créer le sélecteur de créneaux horaires (08:00, 09:00, 10:00, etc.).
* Intégrer la liste d'historique des réservations détaillant la date, le prix et la méthode de paiement.

**Phase 5 : Intégration de l'écran "Classement"**
* Créer le graphique circulaire principal pour le "Score de Crédit" (ex: 8450 pts).
* Intégrer la liste interactive "Top 10 Résidence" avec les avatars et les scores des utilisateurs.
* Programmer l'ouverture d'une fenêtre modale (popup) expliquant les règles de calcul du score.

**Phase 6 : Intégration de l'écran "Profil"**
* Intégrer l'en-tête avec la photo, le nom complet, l'e-mail et le numéro de contact.
* Ajouter le résumé rapide du score total en haut du profil.
* Concevoir la liste de navigation pour la gestion du compte (Données personnelles, Moyens de paiement, Notifications, Paramètres, etc.).

**Phase 7 : Interactions et Tests**
* Lier la navigation.

**Extras**
*Ajouter une carte geographique Julian RAYES
*Ajouter un mini modal pre-profil Julian RAYES

## 👥 Équipe (Group 4 Laveries)
* Facundo ARITO
* Juan BAUDINO
* Juan DE MIGUEL
* Julian RAYES

**Enseignant :** Sébastien KUBICKI
