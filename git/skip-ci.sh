if [[ ! $(git log -1 --pretty=%B) =~ (\[ci skip\])|(\[skip ci\]) ]]; then echo "git push" && echo "git push --tags"; fi
