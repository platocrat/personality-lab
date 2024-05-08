# personality-lab

## Getting started

First, run the development server:

```zsh
npx turbo dev
```

Open <http://localhost:3000> with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses `next/font` to automatically optimize and load Inter, a custom Google Font.


## Deploying Next.js app to AWS EC2 instance and viewing it with NGINX

### 1. Setup with `nginx`

[Tutorial video](https://www.youtube.com/watch?v=IwWQG6lEdQQ)

#### 1. SSH in to EC2 instance

<!-- 

EC2_USERNAME = ec2-user 
EC2_HOSTNAME = 52.54.185.71

-->

```zsh
ssh -i key-pair-name.pem EC2_USERNAME@EC2_HOSTNAME
```

#### 2. Install `nginx`

```zsh
sudo yum install nginx -y
```

#### 3. Start/Restart `nginx` service

```zsh
sudo service nginx restart
```

### 2. On EC2 instance, configure NGINX

#### 1. Create NGINX configuration file

<!-- 

NGINX configuration file = /etc/nginx/conf.d/personality-lab-app.conf

 -->

```zsh
sudo vim /etc/nginx/conf.d/<APP_NAME>.conf
```

#### 2. File out configuration file like so

<!-- 

EC2_HOSTNAME = 52.54.185.71

-->

```
server {
    listen 80;
    server_name EC2_HOSTNAME; 
  
    location / {
        proxy_pass http://127.0.0.1:3000/;
    }
}
```

#### 3. Restart `nginx` service

```zsh
sudo service nginx restart
```

### 3. On EC2 instance, install Docker, login, and start the Docker daemon

#### 1. Install Docker

```zsh
sudo yum install docker -y
```

#### 2. Login to Docker

```zsh
sudo docker login -u platocrat
```

When prompted for a password, enter your personal access token that you get from Docker Hub

#### 3. Start the Docker daemon

```zsh
sudo systemctl restart docker
```

#### 4. Prune all data from Docker

```zsh
sudo docker system prune -a
```

### 4. Push new commits to GitHub to see the GitHub Action automate the deployment process

### 5. Manually start the Next.js app by running the image

#### 1. Make sure the Docker daemon is running

```zsh
sudo systemctl restart docker
```

#### 2. Make sure to restart NGINX service

```zsh
sudo service nginx restart
```

#### 3. Run the image of the Next.js app

Make sure to specify the correct port number that is used in the NGINX configuration file, `<APP_NAME>.conf` under the `proxy_pass` variable.

Also, make sure to specify the `<IMAGE_ID>` and *not* the image name.

```zsh
sudo docker run -it -p 3000:3000 <IMAGE_ID>
```

<!-- ## Manual Deployment of Next.js app to AWS EC2 instance

> NOTE: This is required because of something that broke the GitsHub Actions automated deployment that was set up previously. -->

## What to do if the SSH key ever gets lost, deleted, or corrupted

### 1. Stop and delete the EC2 instance and launch a new one

Do this from the AWS Console in the browser.

### 2. In the menu to launch a new EC2 instance, create a new SSH key pair

Select the encryption method that you are most comfortable with, I choose ED25519.

### 3. Follow the instructions on the `Connect` page to SSH into the new EC2 instance

1. Open an SSH client.
2. Locate your private key file. The key used to launch this instance is personality-lab-app.pem
3. Run this command, if necessary, to ensure your key is not publicly viewable.

    ```zsh
    chmod 400 "key-pair-name.pem"
    ```

4. Connect to your instance using its Public DNS

    ```zsh
    EC2_HOSTNAME.compute-1.amazonaws.com
    ```

Example:

```zsh
ssh -i "key-pair-name.pem" EC2_USERNAME@EC2_HOSTNAME.compute-1.amazonaws.com
```
