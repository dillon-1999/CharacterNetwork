# Installation & Setup Guid3
## <ins>Download Node.js</ins>
- Go to `https://nodejs.org/en/download/` and click on mac/windows installer and run through that setup

## <ins>Make sure to have git installed and your account setup on your machine</ins>
### clone the repo
- `git clone https://github.com/dillon-1999/CharacterNetwork.git` in whatever directory you wish to hold it

## <ins>Install all necessary packages in the project</ins>
- run `npm install` in the cloned directory (this may take a minute)

## <ins>Create a .env file</ins>
- you'll need the variables `COOKIE_SECRET`, `PORT`, & `MODE`
- make sure the .env is in your .gitignore(it should be just from cloning) because we want these hidden from the public
- i'll share out the values that need to be placed, it'll get changed when we push the production code

## <ins>install redis</ins>
### `home brew` on mac is your easiest way to manage packages, i recommend installing this if you havent 
- Guide: `https://treehouse.github.io/installation-guides/mac/homebrew`
- run via command line `brew update; brew install redis`

## <ins>Use the scripts in the package.json to start the code</ins>
- `npm run start-dev`
- `npm run start`
- this will initialize your DB and start your local server

## <ins>This is everything I can think of at this time, if you have any error messages or problems:</ins>
- google them first
- if you can't resolve, message me!