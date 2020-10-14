package util

import (
	"bufio"
	// _ "errors" // ?
	"io"
	"os"
	"regexp"
	"strings"

	"github.com/labstack/gommon/log"
)

// var vim-conf *os.FileInfo
var err error

var EnvMap map[string]string

// const is member of util package
const (
	TagRequest         = "<Request>"
	TagResponse        = "<Response>"
	TagStatusCodeStart = "<StatusCode>"
	TagStatusCodeEnd   = "</StatusCode>"
	//	TagStatusCodeLen   = len(TagStatusCodeStart)
	TagSystem        = "<System>"
	TagMethodStart   = "<Method>"
	TagMethodEnd     = "</Method>"
	TagMethodLen     = len(TagMethodStart)
	TagURIStart      = "<URI>"
	TagURIEnd        = "</URI>"
	TagURILen        = len(TagURIStart)
	TagFileDataStart = "<FileData>"
	TagFileDataEnd   = "</FileData>"
	TagFileDataLen   = len(TagFileDataStart)
	TagBodyStart     = "<Body>"
	TagBodyEnd       = "</Body>"
	TagBodyLen       = len(TagBodyStart)
	TagResDataStart  = "<ResData>"
	TagResDataEnd    = "</ResData>"
	//	TagResDataLen      = len(TagResDataStart)
	TagNamespaceStart = "<Namespace>"
	TagNamespaceEnd   = "</Namespace>"
	//	TagNamespaceLen    = len(TagNamespaceStart)
	TagNameStart = "<Name>"
	TagNameEnd   = "</Name>"

//	TagNameLen         = len(TagNameStart)
)

// APIList is member of util package
type APIList struct {
	Method string
	URI    string
}

// APILists is member of util package
var APILists []APIList

func Init() {

	confFile := "./config/ce-vim.conf"

	// _, err := os.Stat(confFile)

	// if err != nil {
	// 	log.Error("Init configuration file not exist")
	//    os.Exit(1)
	// } else {
	EnvMap = read(confFile)
	// }

}

/*
read all env (with same file loading semantics as Load) but return values as
a map rather than automatically writing values into env
*/
func read(filename string) (envMap map[string]string) {
	envMap = make(map[string]string)

	// var bExistFile bool
	tmpEnvMap, err := readFile(filename)
	if err == nil {
		log.Info("Read configfile :", filename)
		// bExistFile = true
		for key, value := range tmpEnvMap {
			envMap[key] = value
		}
	} else {
		log.Info("Error :", err.Error())
	}

	// if bExistFile == false {
	// 	log.Info("Fatal : Configfile does not exist. Set to the default configuration.")
	// 	reader := strings.NewReader(defaultConfig)
	// 	tmpEnvMap, err := parse(reader)
	// 	if err != nil {
	// 		log.Info("Fatal :", err.Error())
	// 		os.Exit(1)
	// 		return
	// 	}

	// 	for key, value := range tmpEnvMap {
	// 		envMap[key] = value
	// 	}
	// }

	return
}

func readFile(filename string) (envMap map[string]string, err error) {
	file, err := os.Open(filename)
	if err != nil {
		return
	}
	defer file.Close()

	return parse(file)
}

// func read(configFile string) (envMap map[string]string) {

// 	envMap = make(map[string]string)

// 	file, err := os.Open(configFile)

// 	if err != nil {
// 		log.Error("Read configuration file open error. ")
// 		os.Exit(1)
// 	}

// 	defer file.Close()

// 	tmpEnvMap, err := parse(file)

// 	if err == nil {
// 		for key, value := range tmpEnvMap {
// 			envMap[key] = value
// 		}
// 	} else {
// 		log.Error("Read configuration file read error. ")
// 		os.Exit(1)
// 	}

// 	return envMap
// }

// parse reads an env file from io.Reader, returning a map of keys and values.
func parse(r io.Reader) (envMap map[string]string, err error) {
	envMap = make(map[string]string)

	var lines []string
	scanner := bufio.NewScanner(r)

	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	if err = scanner.Err(); err != nil {
		log.Error("configuration scan error. ")
		return
	}

	for _, line := range lines {
		if !isIgnoredLine(line) {
			key, value, parseErr := parseLine(line, envMap)
			if parseErr != nil {
				log.Error("configuration parsing error. ")
				return
			}
			envMap[key] = value
		}
	}
	return
}

func parseLine(line string, envMap map[string]string) (key string, value string, err error) {
	if len(line) == 0 {
		log.Error("configuration file length is zeror")
		return
	}

	// ditch the comments (but keep quoted hashes)
	if strings.Contains(line, "#") {
		segmentsBetweenHashes := strings.Split(line, "#")
		quotesAreOpen := false
		var segmentsToKeep []string
		for _, segment := range segmentsBetweenHashes {
			if strings.Count(segment, "\"") == 1 || strings.Count(segment, "'") == 1 {
				if quotesAreOpen {
					quotesAreOpen = false
					segmentsToKeep = append(segmentsToKeep, segment)
				} else {
					quotesAreOpen = true
				}
			}
			if len(segmentsToKeep) == 0 || quotesAreOpen {
				segmentsToKeep = append(segmentsToKeep, segment)
			}
		}

		line = strings.Join(segmentsToKeep, "#")
	}

	firstEquals := strings.Index(line, "=")
	firstColon := strings.Index(line, ":")
	splitString := strings.SplitN(line, "=", 2)

	if firstColon != -1 && (firstColon < firstEquals || firstEquals == -1) {
		splitString = strings.SplitN(line, ":", 2)
	}

	if len(splitString) != 2 {
		log.Error("configuration can't seperate key from value")
		return
	}

	// Parse the key
	key = splitString[0]
	if strings.HasPrefix(key, "export") {
		key = strings.TrimPrefix(key, "export")
	}

	key = strings.TrimSpace(key)
	re := regexp.MustCompile(`^\s*(?:export\s+)?(.*?)\s*$`)
	key = re.ReplaceAllString(splitString[0], "$1")

	// Parse the value
	value = parseValue(splitString[1], envMap)
	return
}

func parseValue(value string, envMap map[string]string) string {
	// trim
	value = strings.Trim(value, " ")

	// check if we've got quoted values or possible escapes
	if len(value) > 1 {
		rs := regexp.MustCompile(`\A'(.*)'\z`)
		singleQuotes := rs.FindStringSubmatch(value)

		rd := regexp.MustCompile(`\A"(.*)"\z`)
		doubleQuotes := rd.FindStringSubmatch(value)

		if singleQuotes != nil || doubleQuotes != nil {
			// pull the quotes off the edges
			value = value[1 : len(value)-1]
		}

		if doubleQuotes != nil {
			// expand newlines
			escapeRegex := regexp.MustCompile(`\\.`)
			value = escapeRegex.ReplaceAllStringFunc(value, func(match string) string {
				c := strings.TrimPrefix(match, `\`)
				switch c {
				case "n":
					return "\n"
				case "r":
					return "\r"
				default:
					return match
				}
			})

			// unescape characters
			e := regexp.MustCompile(`\\([^$])`)
			value = e.ReplaceAllString(value, "$1")
		}

		if singleQuotes == nil {
			value = expandVariables(value, envMap)
		}

	}
	return value
}

func expandVariables(v string, m map[string]string) string {
	r := regexp.MustCompile(`(\\)?(\$)(\()?\{?([A-Z0-9_]+)?\}?`)

	return r.ReplaceAllStringFunc(v, func(s string) string {
		submatch := r.FindStringSubmatch(s)
		if submatch == nil {
			return s
		}

		if submatch[1] == "\\" || submatch[2] == "(" {
			return submatch[0][1:]
		} else if submatch[4] != "" {
			return m[submatch[4]]
		}
		return s
	})
}

func isIgnoredLine(line string) bool {
	trimmedLine := strings.TrimSpace(line)
	return len(trimmedLine) == 0 || strings.HasPrefix(trimmedLine, "#")
}
