## ORM web-ui | Main/dev branch
Set up an .env file depending on your back-end production. 

``DATABASE_URL="postgresql://postgres:pgpwd@localhost:5432/prismadb?schema=public"``

``API_GET_URL="localhost:5000/api/orm/core/get"``

``API_POST_URL="localhost:5000/api/core/post"``

For dev env: 
``bun dev``

For building: 
``bun run build``
then
``bun run start``

## Partner web-ui | Partners branch

``DATABASE_URL="postgresql://postgres:pgpwd@localhost:5432/prismadb?schema=public"``

``API_GET_URL="localhost:5000/api/core/partners/get"``

``API_POST_URL="localhost:5000/api/core/partners/post"``

For dev env: 
``bun dev``

For building: 
``bun run build``
then
``bun run start``

### Thanks for the attention
Simple as that :)
