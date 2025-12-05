# Submit sync Workflow

exec command
```bash
DT=$(date +"%Y-%m-%d")
SOURCE_BRANCH=dev
TARGET_BRANCH=main

git co ${TARGET_BRANCH}
git pull 
git co -b chore/sync_dev_main
git merge --no-ff --no-commit remotes/origin/${SOURCE_BRANCH}
git commit -m "chore: trunk-sync with ${SOURCE_BRANCH} to ${TARGET_BRANCH} ($DT)"
```