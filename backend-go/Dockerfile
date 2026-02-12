FROM golang:1.25.7-alpine AS builder

WORKDIR /usr/src/backend-go
COPY go.mod ./
COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server


FROM alpine:latest

WORKDIR /usr/src/backend-go

COPY --from=builder /usr/src/backend-go/server .

EXPOSE 5000

CMD ["./server"]
