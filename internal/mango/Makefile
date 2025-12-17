.PHONY: build

build:
	mkdir -p build;
	GOOS=js GOARCH=wasm go build -o ./build/mango.wasm cmd/main.go;
	cp "$(shell go env GOROOT)/lib/wasm/wasm_exec.js" ./build/wasm_exec.js
	cp public/index.html ./build/index.html

serve:
	python3 -m http.server 8080 -d build

fmt:
	go fmt ./cmd
