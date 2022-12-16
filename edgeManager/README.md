# EdgeManager 실행방법
---
## 1. backend/.env 파일 변경
- 로컬 : PROJECT_NAME=Edge, FLASK_ENV=Local
- 개발 : PROJECT_NAME=Edge, FLASK_ENV=Dev
- 상용 : PROJECT_NAME=Edge, FLASK_ENV=Prod

## 2. 실행방법 (edgeManager 디렉토리에서)
- frontend 빌드 시 : sh start.sh build
- backend 실행 시 : sh start.sh run