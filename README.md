# hyper-selenium-cleaner

## Approach

I don’t want to bother with creating and maintaining images. Therefore I am going to use stock Docker images.

```
hyper volume create --name hyper-selenium-cron
```

## Image setup

```
hyper run --rm -ti -v hyper-selenium-cron:/data --size=s3 circleci/node bash
```

```sh
cd

# Install Hyper
wget https://hyper-install.s3.amazonaws.com/hyper-linux-x86_64.tar.gz
tar xzf hyper-linux-x86_64.tar.gz
sudo mkdir -p /data/bin
sudo mv hyper /data/bin
```

