# Music Streaming Website project

This project is a 2 people group project using a React library for the client-side and a MongoDB database with a NodeJS/Express environment for the server-side.

## Project Structure

For this practical work, the source code contains two distinct applications: a ReactJS client-side application (in the `client` directory) and a NodeJS/Express server-side application (in the `site-web` directory). The React application consists of components found in the `components` and `pages` directories. Static files such as the base HTML page are located in `/public`. Upon launching the application, the `index.jsx` file will be executed.

The server, on the other hand, includes controllers, services, and default data that you can find in `server/controllers`, `server/services`, and `server/data`, respectively. The `server.js` file will be executed when launching the server.

## Installation of Required Libraries

To install the necessary dependencies, run the `npm ci` command in the root of each application (thus twice in total). This will install all the libraries defined in the `package-lock.json` file. You can then use the test libraries (for the server) and the scripts defined in the same file.

## Local Deployment

During development, you can locally deploy your ReactJS application and your Express server with the `npm start` command. Note that you need to execute the command at the root of each application (in `/site-web` and `/server`) in two distinct consoles so that both work in parallel.

The React application will be launched at `localhost:5010` (or `<your-IP-address>:5010`), where you can view your website. The server will be deployed at `localhost:5020` and will start listening on port 5020.

## Running Tests

The server source code comes with a series of tests that verify the interactions between your server and a MongoDB instance. The test source code is available in the `server/tests` directory.

You can run automated unit tests with the `npm test` command. This will execute the tests and produce a report in your terminal.

## Song List

The files of the initial songs are available in the `assets/media` directory. The songs are royalty-free and obtained from the [pixabay](https://pixabay.com/music/) website. You can add additional songs to your submission if you wish, ensuring to update the song information in the `songs.json` file in the `data` directory of your server.
