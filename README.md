# Pelican: A Client-Side Fishing Companion App for Stardew Valley
## Objective
Pelican is my capstone project, which was developed in my final semester in fall 2026. The project embodies all that I learned in my time as a full-stack development student. 
Personally, I took this as an opportunity to build something that both solved a problem for a community that I am a part of (which provided a good knowledge base for solving the problem)
and to create something that could develop into a proper full-stack web application as I continue to refine my skill set. The inspiration to develop this idea came from a feeling of 
frustration as I attempted to complete the fishing log in the game Stardew Valley; this process exposed a lack of meaningful ways to view data related to the profession and track one’s progression in-game.

## Synopsis
This project was inspired by several other web applications that make searching for game-based information more accessible to users. Many videogame communities have community-made tools that better 
the average player’s experience in-game. One of these projects is an interactive map for the game The Legend of Zelda: Breath of the Wild, which shows players where various collectibles are in-game 
while letting them save their data in-browser. The usefulness of this tool motivated me to create something for another game’s player base and to solve a niche problem. My friends and I share 
frustrations with the fishing system in Stardew Valley, which ultimately encouraged me to build my capstone around this subject.

## Process
I started by building wireframes for each of the main pages in the web app. The login and signup pages were built as placeholders for implementing user account CRUD features in a future update. 
The homepage and tracker pages provided immediate functionality and were the primary focus of this project. While each page had proper HTML and CSS foundations made during development, most of the 
JavaScript completed for this project was focused on the tracking functionality of the application. This allowed for the user to filter fish by various conditions (catch status, location, season, 
time, etc.) and toggle their caught status. 
<br><br>
I also wrote the JSON file containing all relevant fish details (name, description, location, season, difficulty, etc.), which serves as the backbone 
for sourcing the data in this project. All information was compiled and normalized from the Stardew Valley Wiki and from the game itself. API calls would have been preferable for retrieving this 
data, but a lack of a public dedicated API for Stardew Valley led to me writing the JSON file instead. This file was reworked multiple times as new problems were discovered during development/
<br><br>
When beginning to work on responsive design for Pelican, I adopted a mobile-first approach for all pages. Since I would utilize media queries to scale the design for wider screens, it made the most 
sense to start with designing for smaller screens.  While this was challenging at first, I continued through this stage with success due to a strong feedback process I implemented. With feedback 
from my peers, my professor, and friends who played the game, understanding what changes would benefit Pelican’s uses the most became more clear. 
<br><br>
*[Note: Pelican is still in development! This area will be updated as development progresses.]*
