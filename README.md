# Care To Share - TDDD27 project
# Functional specs

The idea for the application is a service for recommending and sharing music with friends and other people. The primary view for the app will be a feed, kind of like a twitter feed, where users can publish posts. These posts can be song or album recommendations which users also can tag with things like emotion.

It will be possible to add comments to the posts and also some form of like-button will be present.

Each user will have a profile, and in this profile the user can add his or her favorite genres and artists. This profile can also be connected to the user's Spotify profile to access playlists and such.


# Technical specs
## General
* The user is able to log in through creating an account or using other social media accounts like Google, Facebook and Spotify.

* The Spotify web API will be used to display and preview songs and albums in the feed.

## Frameworks

The application will be using the MERN stack, i.e. the frameworks ** MongoDB, Express, React and Node.js. ** This is convenient as JavaScript can be used through the whole application. Also the MEAN and MERN stacks are widely used so it it easy to find documentation and examples. As much as possible of the heavy lifting will be performed in the backend using Node and Express.


For the frontend the framework React will be used in combination with Redux for managing application state. Part of the reasoning behind choosing React over Angular is that I am in the progress of learning mobile app development using React Native and this is a good opportunity to dive deeper into React.

## Deployment
The goal is to deploy the application at the end of the course, at for example Openshift.
