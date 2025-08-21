if [[ $(git log -1 --pretty=%B) == "added node apps" ]]; then echo nice; else echo wrong; fi
