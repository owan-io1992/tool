# Submit sync Workflow

exec command
```bash
DT=$(date +"%Y-%m-%d")
SOURCE_BRANCH=dev
TARGET_BRANCH=main

git co ${TARGET_BRANCH}
git pull 
git br -D chore/sync_dev_main
git co -b chore/sync_dev_main
git merge --no-ff --no-commit remotes/origin/${SOURCE_BRANCH}
git commit -m "chore: trunk-sync with ${SOURCE_BRANCH} to ${TARGET_BRANCH} ($DT)"

git push -u origin chore/sync_dev_main -f -o merge_request.create \
-o merge_request.target=${TARGET_BRANCH} \
-o merge_request.remove_source_branch \
-o merge_request.title="chore: trunk-sync with ${SOURCE_BRANCH} to ${TARGET_BRANCH} ($DT)" \
-o merge_request.description="chore: trunk-sync with ${SOURCE_BRANCH} ($DT)" \
-o merge_request.draft
```