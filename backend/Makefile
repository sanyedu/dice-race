SOURCE:=excel/data.xlsx
DEST:=../frontend/src/app/course/data.json

.PHONY: all clean
all: $(DEST)

.PHONY: watch
watch:
	@echo pip install https://github.com/joh/when-changed/archive/master.zip
	when-changed $(SOURCE) make $(DEST)

$(DEST): $(SOURCE)
	node dist/entry/cli/data_excel_to_json.js $< > $@

clean:
	rm -f $(DEST)