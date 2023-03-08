# Test technique pour Dendreo
![image](https://user-images.githubusercontent.com/1331250/223863757-c4e0be70-3f3e-44bb-a3c6-a537d38076ea.png)


## Démo
Vous pouvez tester le projet sur codepen : https://codepen.io/vuzonp/pen/Exewmjg

## Installation

```
git clone git@github.com:vuzonp/dendreo-test.git
cd ./dendreo-test
npm install && npm start
```
Ouvrez votre navigateur : http://localhost:1234/

## Explications

### Outils
- Utilise Parcel pour générer un environnement de dev. 
- Pour l'UI s'appuie sur [Tailwind](https://tailwindcss.com/).
- La lib JS est [JQuery](https://jquery.com/) afin de se rapprocher de l'environnement de Dendreo 

### Temps passé : 

#### Prérequis
- Lecture de l'énoncé / compréhension : **13 minutes**
- Préparation de l'environnement (config de Parcel, des dépendances Jquery et Tailwind) : **27 minutes**

**Temps total : 40 minutes**

#### Exercice 1
- Conception (structure code, direction à prendre...) : **50 minutes**
- Intégration (HTML / CSS) : **35 minutes**
- JS : **74 minutes** - *Beaucoup de temps perdu à cause de mon habitude de travailler avec Angular. Je suis parti sur des composants JS mais sans outil de templating Html ça ne convenait pas.  J'ai compris trop tard que j'attaquais mal l'exercice et j'ai dû recommencer*.

**Temps total : 2h39**

#### Exercice 2
*Je n'ai pas eu de difficulté majeure sur cette partie, j'ai su assez rapidement comment je souhaitais appréhender la forme.*
**Temps total : 1h26**

#### Exercice 3 
*J'ai réalisé un premier jet fonctionnel avant de m'apercevoir que je saturais trop mon code qui devenait difficile à maintenir et peu lisible. J'ai alors décidé de sortir la manipulation des données dans une classe séparée et de rendre générique les classes html de mes tableaux pour simplifier la logique des sélecteurs / événements DOM.*

- 1er jet "brouillon" : **34 minutes** 
- 2ème version avec refacto et nettoyage: **142 minutes**

**Temps total : 2h56**

#### Fix
*Au moment de livrer je me suis aperçu que j'avais oublié une feature majeure : les boutons qui permettent de sélectionner toutes les valeurs d'un coup. Je viens de corriger ça*

**Temps total : 1h35 minutes**

---

**Total tous exercices : 8h16 minutes**

### Retour global
Le test est très intéressant à coder et motivant. Par ailleurs, l'énnoncé initial est parfaitement clair et permet de savoir où se diriger assez rapidement. 

Je ne suis pas vraiment satisfait du temps passé dessus. Les causes sont multiples mais la principale difficulté que j'ai rencontrée consitait à trouver comment structurer le code en partant *from scratch*. Le projet étant à la fois trop simple pour nécessiter une stack technique évoluée et trop riche pour accumuler les lignes de code à la suite. Une autre cause est la reprise en main de Jquery que je n'utilise plus à mon poste actuel.

Dans l'ensemble, le résultat en terme d'UI/X me plaît et l'idée de scinder un tableau complexe en 2 tableaux simples est très efficace.  
