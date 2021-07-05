run:
	go run main.go
push:
	scp bin/main root@cpo.pumpcharge.com:/root/cpo_backend/bin/main
build:
	env GOOS=linux GOARCH=amd64 go build -o bin/main main.go
access : 
	ssh root@cpo.pumpcharge.com
