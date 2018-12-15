When creating a ground up app using sequelize you must go through the `init` process.

`npm init` > `npm install express express-handlebars mysql2 path sequelize` > `sequelize init` or ` node_modules/.bin/sequelize init` ( I ran into issues using node pathing for the init but then needed it for the db:migrate)
and this is needed too `npm install --save sequelize-cli`

THen you can create simple models from the command line `sequelize model:generate --name Summoner --attributes summName:string,summID:string,summIcon:string,summLvl:string,accID:string,revisDate:string`


You can then create the database only in mysql workbench and the command line can create the tables

`node_modules/.bin/sequelize db:migrate` - this runs any models and migrations you made using the model:generate


So I've got the first tables I need, now we just need to create a safe API .env to hold the api key for riot and start working on ajax calls and api/html routes to populate.

Consider experience from users on wander-group project 2. 



Helpful sequelize links
https://github.com/sequelize/cli
http://docs.sequelizejs.com/manual/tutorial/migrations.html




Checklist 
MOdel - started
View - not started need handlebars views
Controller - not started api/html routes. 

Tests??? - need tests to make sure the first ajax to riot api will properly get the data and store it into database. 

