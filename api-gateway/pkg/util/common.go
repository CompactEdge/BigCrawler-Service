package util

import (
	"bytes"
	"io"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/labstack/gommon/log"
)

// ParseFileDataToString ...
func ParseFileDataToString(request *http.Request) (string, error) {
	file, header, err := request.FormFile("file")
	if err == nil {
		log.Info("Parsing from ", header.Filename)

		var Buf bytes.Buffer
		_, _ = io.Copy(&Buf, file)
		defer file.Close()

		contentType := header.Header.Get("Content-Type")
		if strings.EqualFold(contentType, "text/yaml") == false {
			return "", nil
		}

		fileExt := filepath.Ext(header.Filename)
		if strings.EqualFold(fileExt, ".yaml") == false {
			return "", nil
		}
		return string(Buf.Bytes()), nil
	}
	return "", err
}
