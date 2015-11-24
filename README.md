<<<<<<< HEAD
# SEAFOAM-s-CliMate-Project




=======

# SEAFOAM's CliMate Project

This is the README markdown for SEAFOAM's CliMate Project.

The primary service of CliMate is to provide a real-time visual representation of the weather for a user-queried city in any country. This markdown will provide full descriptive details about CliMate, including which APIs will be utilized, technologies used (langauages, frameworks, packages, etc.), where the application is hosted online, etc.

### Contents

- Team SEAFOAM
- Description of CliMate
- Technologies/APIs used
- Hosting site

### Team SEAFOAM

| Name               | Slack               | Email                    | GitHub      |
|--------------------|:-------------------:|:------------------------:|:-----------:|
| Sam Hager          | @samhager11         | sam.hager11@gmail.com    | /samhager11 |
| Elnaz Shahla (PM)  | @eshahla            | ess9213@yahoo.com        | /eshahla    |
| Andrew Kim         | @andyjinkim         | andyjinkim@gmail.com     | /andyjinkim |

### Description of CliMate

CliMate will provide ONLY logged in users the ability to query any city in a search bar via the Weather Underground API. If a user does not have a profile, they must CREATE one prior to using CliMate's services. Upon a query of a valid location, the application will provide a weather report and a real-time visual representation of the current weather. For example, if the weather is windy, a visual representation of wind will appear on the screen. Snow for snowy, sun for sunny, etc. This visual representation will be presented with the use of J5 or CSS. <!-- Additional description of weather simulation, upon completion of application -->. Upon a valid query, in addition to providing the visual representation, there will be additional information provided to the logged in user via the APIs below.

One is the Uber API, where the logged in user will be able to find rides based on a location provided by the logged in user. The API would provide fare estimates, Uber product options, maps, and, most importantly, authentication.

Second is the Jet API. Jet is a marketplace (similar to Amazon) where logged in users can purchase any kind of product, varying from apparel to toiletries to food to electronics, etc. The hope here is, upon a city query, to be able to pull the weather data (windy, sunny, snow, etc.) and send that data to the Jet API query and automatically pull results for the logged in user.

Lastly, the Yelp API will be utilized to provide the logged in user with restaurant and business searches for the given city query.

There will be full CRUD functionality for users for their profiles. Users will be able to CREATE a user profile, and upon signing in, have the ability to READ their user info, UPDATE/edit their information, and DESTROY their user profile. If the user attempts to provide credentials and fails at authentication three times in a row, they will be forwarded to the CREATE user (sign-up) page.

The logged in user queries will be logged to a Mongo database. The object will include keys of city, state (if applicable), and country, all of which will be strings.

## Technologies/APIs Used

- APIs Used: Weather Underground, Yelp, Uber, Jet
- Languages/Technologies Used: MongoDB, Express, NodeJS, HTML, CSS
- Possible additional languages/technologies used: J5, Bootstrap

## Hosting Site

The current plan is to initiation CliMate as a Git Repository and push the application to Heroku for public consumption.

## User Stories

Story 1 - The Commuter: I live 20 blocks from work. Those 20 blocks are delightfully walked on a warm, sunny day but if it's raining or snowing, forget it. I check the weather on my desktop before work every day and then decide whether or not to call an uber. I want to log into the app on my computer, visually see the weather as it is outside and be able to call an uber all in one shot - is that so much to ask?

Story 2 - The Shopper: I can't tell you how many times winter has snuck up on me and I am completely unprepared. If I could actually see the snow on my weather app I would remember the cold in my bones from last year and get a jump on purchasing my winter gear for the season. I want to SEE the weather and be able to make purchases directly from the app.

Sotry 3 - The Traveler: I travel all over for work but never really know where I'm at. I want to login to the app, see the weather for my location and be able to find restaurants close by, especially if the weather outside is not particularly friendly for walking. 
>>>>>>> 173781a050f08658ae3ce2f8dbed0b663d3b80fc

