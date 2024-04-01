<h1 align="center">
    <br>
    <a href="https://montvalsurloir.bibli.fr/doc_num.php?explnum_id=4140">
        <img src="/public/logo.svg" alt="Logo du jeu" width="200">
    </a>
    <br>
    Punto
</h1>

<h4 align="center">Jeu de société fusionnant le Puissance 4 et le Morpion</h4>

<p align="center">
  <a href="#✨-roadmap">Roadmap</a> •
  <a href="#🛠️-lancer-l'application">Démarrer</a> •
  <a href="#🕹️-outils-utilisés">Outils</a> •
  <a href="#👋-me-contacter">Contact</a> •
  <a href="#🤠-crédits">Crédit</a> •
  <a href="#©-licence">Licence</a> •
</p>

![Screenshot de l'application](/public/README/punto.png)

> **NOTE:** Ce projet est réalisé dans le cadre d'un projet à l'IUT de Vannes.

## ✨ Roadmap

- [x] Jouer au jeu ✅
- [x] Générer des parties aléatoires ✅
- [x] Visionner l'historique des parties ✅
- [x] Supporter MySQL et SQLite en base de données ✅
- [ ] Supporter MongoDB ⏳

## 🛠️ Lancer l'application

### Code

Pour clôner le projet et lancer l'application, vous aurez besoin d'installer [Git](https://git-scm.com) et [Node.js](https://nodejs.org/en/download/) (qui installe [npm](http://npmjs.com)). 

**Installer l'application**

```bash
# Clôner le projet
$ git clone https://github.com/HeineZo/Punto

# Se déplacer dans le projet
$ cd Punto

# Installer les dépendances
$ npm install
```

**Remplir les données de connexion**

Créez un fichier `.env` et copiez-y le contenu du fichier `.env.local`. Remplissez les informations correspondantes dans le fichier `.env`

**Lancez l'application**

```bash
# Lancer le client
$ npm run client

# Lancer le serveur (dans un autre terminal)
$ npm run server
```
Enfin, rendez vous à l'adresse suivante: https://localhost:3001


## 🕹️ Outils utilisés

<p align="center">
   <img src="https://skillicons.dev/icons?i=react,typescript,nodejs,mysql,sqlite,express,vite" alt="Les technologies utilisées" />
</p>

## 👋 Me contacter
<a href="https://discord.com/invite/enzolefrigo">
   <img src="https://skillicons.dev/icons?i=discord" width="50" alt="Me contact" />

   @enzolefrigo
</a>

## 🤠 Crédits

<table>
    <tr>
        <td align="center">
            <a href="https://github.com/HeineZo">
                <img src="https://avatars.githubusercontent.com/u/85509892?v=4" width="100px;" alt="Image de profil" style="border-radius: 100%"/>
                <br />
                <sub><b>Enzo</b></sub>
            </a>
            <br />
            <a title="Code">💻</a> 
            <a title="Design">🎨</a> 
        </td>
    </tr>
</table>

## © Licence

[MIT](LICENSE)
