# this is for development prupose only
Dockerfile.dev 

in this branch, i have used nginx to handle the redirections mainly the below :

upstream client {
    server client:3000;
}

upstream api {
    server api:5000;
}

server {
    listen 80;

    location / {
        proxy_pass http://client;
    }

    location /sockjs-node {
        proxy_pass http://client;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }

    location /api {
        proxy_pass http://api;
    }
}

NB: IIN my client (react-app ) i have prefixed the call to my server with /api
Since in my server i have left the /api as a prefix to call my  exposed services in ServerController.ts
so i don't need the rewrite the request comming to the server .

In case I don't have the /api prefix in my   ServerController.ts is have to rewrite the incoming request like below

location /api {
    rewrite /api/(.*) /$1 break; // rewrite rule , $1 is the matched text
    proxy_pass http://api;
}



rewrite /api/(.*) /$1 break; // rewrite rule to match the text after the /api/ and then store it in $1 
then send the matched text ($1) e.g /api/values/all -> /values/all
the word break is telling nginx that once rule is done stop and don't apply any rule 