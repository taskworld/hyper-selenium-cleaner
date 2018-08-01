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

# Checkout repo
sudo mkdir -p /data/src
sudo chown circleci:circleci /data/src
git clone https://github.com/taskworld/hyper-selenium-cleaner.git

# Create config
sudo mkdir -p /data/config/hyper
sudo chown circleci:circleci /data/config/hyper
cat > /data/config/hyper/config.json <<'END'
  [paste contents of ~/.hyper/config.json here]
END

# Check if it works!
alias hyper='/data/bin/hyper --config=/data/config/hyper'
hyper ps
```

## Run once

```
hyper run --rm -v hyper-selenium-cron:/data --size=s3 circleci/node \
  node /data/src/hyper-selenium-cleaner/clean.js
```

## Run as cron

```
hyper cron create \
  --minute='*/5' --hour='*' --name=hyper-selenium-cleaner \
  -v hyper-selenium-cron:/data --size=s3 circleci/node \
  node /data/src/hyper-selenium-cleaner/clean.js
```

## Update code

```
hyper run --rm -v hyper-selenium-cron:/data --size=s3 circleci/node \
  bash -c 'cd /data/src/hyper-selenium-cleaner && git pull'
```