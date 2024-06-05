# personality-lab

## Getting started

First, run the development server:

```zsh
npx turbo dev
```

Open <http://localhost:3000> with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses `next/font` to automatically optimize and load Inter, a custom Google Font.

## Table of Contents

- [Launch a new EC2 instance on AWS console](#launch-a-new-ec2-instance-on-aws-console)
  - [1. Application and OS Images](#1-application-and-os-images)
  - [2. Instance Type](#2-instance-type)
  - [3. Key pair (login)](#3-key-pair-login)
  - [4. Network Settings](#4-network-settings)
- [Deploying Next.js app to AWS EC2 instance and viewing it with NGINX](#deploying-nextjs-app-to-aws-ec2-instance-and-viewing-it-with-nginx)
  - [1. Setup with `nginx`](#1-setup-with-nginx)
    - [1. SSH in to EC2 instance](#1-ssh-in-to-ec2-instance)
    - [2. Install `nginx`](#2-install-nginx)
    - [3. Start/Restart `nginx` service](#3-startrestart-nginx-service)
  - [2. On EC2 instance, configure NGINX](#2-on-ec2-instance-configure-nginx)
    - [1. Create NGINX configuration file](#1-create-nginx-configuration-file)
    - [2. File out configuration file like so](#2-file-out-configuration-file-like-so)
    - [3. Restart `nginx` service](#3-restart-nginx-service)
  - [3. On EC2 instance, install Docker, login, and start the Docker daemon](#3-on-ec2-instance-install-docker-login-and-start-the-docker-daemon)
    - [1. Install Docker](#1-install-docker)
    - [2. Login to Docker](#2-login-to-docker)
    - [3. Start the Docker daemon](#3-start-the-docker-daemon)
    - [4. Prune all data from Docker](#4-prune-all-data-from-docker)
  - [4. Push new commits to GitHub to see the GitHub Action automate the deployment process](#4-push-new-commits-to-github-to-see-the-github-action-automate-the-deployment-process)
  - [5. Manually start the Next.js app by running the image](#5-manually-start-the-nextjs-app-by-running-the-image)
    - [1. Make sure the Docker daemon is running](#1-make-sure-the-docker-daemon-is-running)
    - [2. Make sure to restart NGINX service](#2-make-sure-to-restart-nginx-service)
    - [3. Run the image of the Next.js app](#3-run-the-image-of-the-nextjs-app)
- [What to do if the SSH key ever gets lost, deleted, or corrupted](#what-to-do-if-the-ssh-key-ever-gets-lost-deleted-or-corrupted)
  - [1. Stop and delete the EC2 instance and launch a new one](#1-stop-and-delete-the-ec2-instance-and-launch-a-new-one)
  - [2. In the menu to launch a new EC2 instance, create a new SSH key pair](#2-in-the-menu-to-launch-a-new-ec2-instance-create-a-new-ssh-key-pair)
  - [3. Follow the instructions on the `Connect` page to SSH into the new EC2 instance](#3-follow-the-instructions-on-the-connect-page-to-ssh-into-the-new-ec2-instance)

## Launch a new EC2 instance on AWS console

### 1. Application and OS Images

1. When launching a new EC2 instance on the AWS console, be sure to use one of the Amazon Machine Images (AMIs). I chose Amazon linux 2023 AMI because it is the fastest.
2. Avoid using 64-bit (Arm) CPU architecture because most software libraries and packages have most of their infrastructure having been tested on use x86 CPU architectures and not on Arm.

### 2. Instance Type

Select `t2.micro` because it is uses the lowest vCPU (1vCPU) and GiB Memory (1 GiB Memory)

### 3. Key pair (login)

1. Specify a key-pair which is used later for remotely SSH'ing in to the EC2 instance from your machine.
2. Make sure to select `Create a new key pair` whenever you launch a new instance; otherwise, you risk getting confused when you use the same key for more than one EC2 instance, and you have to manage the keys in the appropriate SSH configuration files (e.g. `.ssh`, `authorized_hosts`, `known_hosts` etc.).

### 4. Network Settings

Create a new security group, or use an existing security group, that has the following three options enabled:

1. `Allow SSH traffic from` (this is defaulted to `Anywhere 0.0.0.0/0` -- keep the default setting enabled)
2. `Allow HTTPS traffic from the internet` (this is disabled by default)
3. `Allow HTTP traffic from the internet` (this is disabled by default)

## Deploying Next.js app to AWS EC2 instance and viewing it with NGINX

### 1. Setup with `nginx`

[Tutorial video](https://www.youtube.com/watch?v=IwWQG6lEdQQ)

#### 1. SSH in to EC2 instance

<!-- 

EC2_USERNAME = ec2-user 
EC2_HOSTNAME = 54.198.211.160

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
sudo vim "/etc/nginx/conf.d/<APP_NAME>.conf"
```

#### 2. File out configuration file like so

<!-- 

EC2_HOSTNAME = 54.198.211.160

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

## What to do if the SSH key ever gets lost, deleted, or corrupted?

### 1. Stop and delete the EC2 instance and launch a new one

Do this from the AWS Console in the browser.

### 2. In the menu to launch a new EC2 instance, create a new SSH key pair

RSA is not as secure as ED25519, so select ED25519 as the encryption method.

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

where `EC2_HOSTNAME` the formatted like so:

```zsh
ec2-54-198-211-160
```

## What to do if want to use a new Elastic IP address?

### 1. Release the old Elastic IP address

Release the old Elastic IP address from the AWS console.

### 2. Allocate a new Elastic IP address

On the AWS console, on the EC2 service, under the "Network & Security" tab and under "Elastic IPs", click the orange, "Allocate Elastic IP address" button.

### 3. Associate the new Elastic IP address to the EC2 instance

1. Toggle the checkbox on the far left of the row of the newly allocated Elastic IP address.
2. Then, click the "Actions" dropdown menu, and select "Associate Elastic IP Address".
3. From this menu, for the Resource type, keep "Instance" selected.
4. For the Instance, select the EC2 instance to associate the Elastic IP address to.
5. Toggle the checkbox to allow reassociation.
6. Finally, click the orange, "Associate" button.
