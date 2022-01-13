# Cirilla

This program is developed by [WhittleGuy](https://github.com/WhittleGuy) and [licensed](https://github.com/WhittleGuy/Cirilla/blob/master/LICENSE.md) under GNU GPL-v3.0.
Cirilla is a custom Discord bot developed to replace industry standard Discord bots. The UX of the bot is text based through Discord's Slash Commands. This project allows the author greater control of the bot features and UX than any closed-source bot could provide.

## Getting Started

### Tokens

This repository requires a [Discord](https://discord.com/developers/docs/intro) bot token and a [MongoDB](https://www.mongodb.com/) URI token. Please see their documentation.

### Dependencies

All dependencies are included in `package.json`.

- This bot makes use of the [WOKCommands](https://www.npmjs.com/package/wokcommands) package, created by [WornOfKeys](https://www.youtube.com/wornoffkeys) and under an ISC License.
- The [canvas](https://www.npmjs.com/package/canvas) package may require you to install additional dependencies on your system. Please see their documentation.

### Clone The Repository

```
$ git clone git@github.com:WhittleGuy/Cirilla.git
```

### Install Dependencies

```
$ yarn install
```

### Launch Application

##### Dev (Watch) Mode

```
$ yarn run dev
```

#### OR

##### Standard ts-node

```
$ yarn start
```
