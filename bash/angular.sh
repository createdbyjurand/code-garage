#!/bin/bash

# Angular
# https://angular.io/cli/new

# source how-to/bash/shared/functions/echo-with-tab.sh
# source how-to/bash/shared/functions/echo-add-tab.sh
# source how-to/bash/shared/functions/executeCommandAndEchoWithTab.sh

# ALL_CLI_VERSIONS=(
#   "8.0.0"
#   "8.0.1"
#   "8.0.2"
#   "8.0.3"
#   "8.0.4"
#   "8.0.5"
#   "8.0.6"
#   "8.1.0"
#   "8.1.1"
#   "8.1.2"
#   "8.1.3"
#   "8.2.0"
#   "8.2.1"
#   "8.2.2"
#   "8.3.0"
#   "8.3.1"
#   "8.3.2"
#   "8.3.3"
#   "8.3.4"
#   "8.3.5"
#   "8.3.6"
#   "8.3.7"
#   "8.3.8"
#   "8.3.9"
#   "8.3.10"
#   "8.3.12"
#   "8.3.13"
#   "8.3.14"
#   "8.3.15"
#   "8.3.16"
#   "8.3.17"
#   "8.3.18"
#   "8.3.19"
#   "8.3.20"
#   "8.3.21"
# )

CLI="8.3.21"
CLI_BRANCH="cli/8"
REPO_FOLDER="angular-cli-ng-new"
PROJECT_NAME="angular-cli-ng-new"
GIT_REMOTE_NAME="origin"

reset

npm i -g @angular/cli@${CLI}

# checkoutOrCreateBranch BRANCH
function checkoutOrCreateBranch() {
  local BRANCH=${1}

  echo "checkoutOrCreateBranch ${BRANCH}"

  echo "git branch --all"
  git branch --all

  echo "git branch --all --list ${BRANCH}"
  git branch --all --list "${BRANCH}"

  echo "git branch --all --list */${BRANCH}"
  git branch --all --list "*/${BRANCH}"

  # if [[ $VAR =~ .*Linux.* ]]; then
  if [[ $(git branch --all --list "${BRANCH}") ]] || [[ $(git branch --all --list "*/${BRANCH}") ]]; then
    echo "Branch ${BRANCH} exists."
    echo "git status"
    git status
    echo "git checkout ${BRANCH}"
    git checkout ${BRANCH}
    echo "git status"
    git status
  elif [[ ${BRANCH} == "css" ]]; then
    echo "Branch ${BRANCH} does not exist."
    echo "Create and checkout orphan branch ${BRANCH}."
    echo "git status"
    git status
    echo "git checkout --orphan ${BRANCH}"
    git checkout --orphan ${BRANCH}
    echo "git status"
    git status
  else
    echo "Branch ${BRANCH} does not exist."
    echo "Create and checkout branch ${BRANCH}."
    echo "git status"
    git status
    echo "git checkout -b ${BRANCH}"
    git checkout -b ${BRANCH}
    echo "git status"
    git status
  fi
}

# addNewCliVersion BRANCH OPTIONS ROOT(optional)
function addNewCliVersion() {
  local BRANCH=${1}
  local OPTIONS=${2}
  local ROOT=${3:-$CLI_BRANCH}
  local DIR=${CLI}-${BRANCH}

  echo "BRANCH: ${BRANCH}"
  echo "OPTIONS: ${OPTIONS}"
  echo "ROOT: ${ROOT}"
  echo "DIR: ${DIR}"
  echo "CLI_BRANCH: ${CLI_BRANCH}"

  echo "rm -rf ${DIR}"
  rm -rf ${DIR}

  echo "ng n ${PROJECT_NAME} --skipInstall=true ${OPTIONS} --directory=${DIR}"
  ng n ${PROJECT_NAME} --skipInstall=true ${OPTIONS} --directory=${DIR}
  echo "rm -rf ${DIR}\\.git"
  rm -rf ${DIR}\\.git

  echo "cd ${REPO_FOLDER}"
  cd ${REPO_FOLDER}
  echo "git remote update --prune"
  git remote update --prune
  echo "checkoutOrCreateBranch ${ROOT}"
  checkoutOrCreateBranch ${ROOT}
  echo "checkoutOrCreateBranch ${BRANCH}"
  checkoutOrCreateBranch ${BRANCH}
  echo "git rm -rf ."
  git rm -rf .
  echo "cd .."
  cd ..

  echo "shopt -s dotglob nullglob"
  shopt -s dotglob nullglob
  echo "cp -rfv ${DIR}/. ${REPO_FOLDER}/"
  cp -rfv ${DIR}/. ${REPO_FOLDER}/

  echo "cd ${REPO_FOLDER}"
  cd ${REPO_FOLDER}
  echo "git status"
  git status
  echo "git add ."
  git add .
  echo "git status"
  git status
  echo "git commit --all -m \"@angular/cli@${CLI} (${BRANCH})\""
  # @angular/cli@$8.3.7 (scss-ivy)
  git commit --all -m "@angular/cli@${CLI} (${BRANCH})"
  echo "git status"
  git status
  git push -u ${GIT_REMOTE_NAME} ${BRANCH}
  # echo "checkoutOrCreateBranch ${ROOT}"
  # checkoutOrCreateBranch ${ROOT}
  # echo "git status"
  # git status
  # echo "git reset --hard"
  # git reset --hard
  # echo "git status"
  # git status
  echo "cd .."
  cd ..
}

# mergeAndDeleteBranch BRANCH
function mergeAndDeleteBranch() {
  local BRANCH=${1}
  local DIR=${CLI}-${BRANCH}

  echo "mergeAndDeleteBranch ${BRANCH}"
  echo "BRANCH: ${BRANCH}"
  echo "DIR: ${DIR}"
  echo "CLI_BRANCH: ${CLI_BRANCH}"

  echo "cd ${REPO_FOLDER}"
  cd ${REPO_FOLDER}
  echo "git checkout ${CLI_BRANCH}"
  git checkout ${CLI_BRANCH}
  echo "git status"
  git status
  echo "git merge --no-commit --no-ff --allow-unrelated-histories ${BRANCH}"
  git merge --no-commit --no-ff --allow-unrelated-histories ${BRANCH}
  echo "git status"
  git status
  echo "git rm -rf ."
  git rm -rf .
  echo "git status"
  git status
  echo "cd .."
  cd ..

  echo "shopt -s dotglob nullglob"
  shopt -s dotglob nullglob
  echo "mv ${DIR}/* ${REPO_FOLDER}/"
  mv ${DIR}/* ${REPO_FOLDER}/
  echo "rm -rf ${DIR}"
  rm -rf ${DIR}

  echo "cd ${REPO_FOLDER}"
  cd ${REPO_FOLDER}
  echo "git status"
  git status
  echo "git add ."
  git add .
  echo "git status"
  git status
  echo "git commit -m \"merge: @angular/cli@${CLI} (${BRANCH})\""
  # merge: @angular/cli@$8.3.7 (scss-ivy)
  git commit -m "merge: @angular/cli@${CLI} (${BRANCH})"
  echo "git status"
  git status
  echo "git branch --all"
  git branch --all
  echo "git push -d ${GIT_REMOTE_NAME} ${BRANCH}"
  git push -d ${GIT_REMOTE_NAME} ${BRANCH}
  echo "git branch --all"
  git branch --all
  echo "git branch -d ${BRANCH}"
  git branch -d ${BRANCH}
  echo "git branch --all"
  git branch --all
  echo "cd .."
  cd ..
}

  addNewCliVersion "css" "--style=css --routing=false"
  addNewCliVersion "css-ivy" "--style=css --routing=false --enable-ivy" "css"
  addNewCliVersion "css-routing" "--style=css --routing=true" "css"
  addNewCliVersion "css-routing-ivy" "--style=css --routing=true --enable-ivy" "css-routing"

  addNewCliVersion "scss" "--style=scss --routing=false" "css"
  addNewCliVersion "scss-ivy" "--style=scss --routing=false --enable-ivy" "scss"
  addNewCliVersion "scss-routing" "--style=scss --routing=true" "scss"
  addNewCliVersion "scss-routing-ivy" "--style=scss --routing=true --enable-ivy" "scss-routing"

  mergeAndDeleteBranch "css"
  mergeAndDeleteBranch "scss"

  mergeAndDeleteBranch "css-ivy"
  mergeAndDeleteBranch "scss-ivy"

  mergeAndDeleteBranch "css-routing"
  mergeAndDeleteBranch "scss-routing"

  mergeAndDeleteBranch "css-routing-ivy"
  mergeAndDeleteBranch "scss-routing-ivy"

#echo "Number of items in original array: ${#ALL_CLI_VERSIONS[*]}"
#for ix in ${!ALL_CLI_VERSIONS[*]}; do
#  CLI="${ALL_CLI_VERSIONS[$ix]}"
#
#  addNewCliVersion "css" "--style=css --routing=false"
#  addNewCliVersion "css-ivy" "--style=css --routing=false --enable-ivy" "css"
#  addNewCliVersion "css-routing" "--style=css --routing=true" "css"
#  addNewCliVersion "css-routing-ivy" "--style=css --routing=true --enable-ivy" "css-routing"
#
#  addNewCliVersion "scss" "--style=scss --routing=false" "css"
#  addNewCliVersion "scss-ivy" "--style=scss --routing=false --enable-ivy" "scss"
#  addNewCliVersion "scss-routing" "--style=scss --routing=true" "scss"
#  addNewCliVersion "scss-routing-ivy" "--style=scss --routing=true --enable-ivy" "scss-routing"
#
#  mergeAndDeleteBranch "css"
#  mergeAndDeleteBranch "scss"
#
#  mergeAndDeleteBranch "css-ivy"
#  mergeAndDeleteBranch "scss-ivy"
#
#  mergeAndDeleteBranch "css-routing"
#  mergeAndDeleteBranch "scss-routing"
#
#  mergeAndDeleteBranch "css-routing-ivy"
#  mergeAndDeleteBranch "scss-routing-ivy"
#done

echo
echo [ DONE ]
