include config.ini
export
ifeq ($(OS),Windows_NT)
	VENV_BIN:=Scripts
else
	VENV_BIN:=bin
endif


DST_DIR:=dist

.PHONY: all build start
all: build
start:
	npm run start
build:
	npm run build
clean:
	-rm -rf $(DST_DIR)
