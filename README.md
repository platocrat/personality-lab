# personality-lab

## Getting started

First, run the development server:

```zsh
npx turbo dev
```

Open <http://localhost:3000> with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses `next/font` to automatically optimize and load Inter, a custom Google Font.

## Deploying NextJS to AWS with `nginx` from local machine

[Tutorial video](https://www.youtube.com/watch?v=IwWQG6lEdQQ)

### 1. SSH in to EC2 instance

<!-- 

EC2_USERNAME = ec2-user 
EC2_HOSTNAME = 52.54.185.71

-->

```zsh
ssh -i key.pem EC2_USERNAME@EC2_HOSTNAME
```

### 2. Install `nginx`

```zsh
sudo yum install nginx
```

### 3. Start/Restart `nginx` service

```zsh
sudo service nginx restart
```

## On EC2 instance, configure NGINX

### 1. Create NGINX configuration file

```zsh
sudo vim /etc/nginx/conf.d/personality-lab-app.conf
```

### 2. File out configuration file like so

```
server {
    listen 80;
    server_name EC2_HOSTNAME; 
  
    location / {
        proxy_pass http://127.0.0.1:3000/;
    }
}
```

### 3. Restart `nginx` service

```zsh
sudo service nginx restart
```


<!-- ## Manual Deployment of NextJS app to AWS EC2 instance

> NOTE: This is required because of something that broke the GitHub Actions automated deployment that was set up previously. -->