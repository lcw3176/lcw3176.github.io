#!/usr/bin/env sh
# abort on errors
set -e
# build
npm run build
# navigate into the build output directory
cd dist
# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME
git init

git checkout -b gh-pages

git add .
git commit -m 'deploy'

git remote add origin git@github.com:lcw3176/lcw3176.github.io.git
git push -u origin gh-pages
cd -