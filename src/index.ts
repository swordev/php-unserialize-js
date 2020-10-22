type LiteralArray = Array<string> & {
	offset?: number
}

function readUntil(array: LiteralArray, keywords: string) {
	let value = ""
	while (
		array.offset < array.length &&
		keywords.indexOf(array[array.offset]) === -1
	) {
		value += array[array.offset]
		array.offset += 1
	}
	if (array.offset < array.length) array.offset += 1
	return value
}

function readString(array: LiteralArray) {
	readUntil(array, ":")
	readUntil(array, '"')
	const string = readUntil(array, '"')
	readUntil(array, ";")
	return string
}

function readNumber(array: LiteralArray, keyword = ";") {
	const numberString = readUntil(array, keyword)
	const number = Number(numberString)
	if (Number.isNaN(number))
		throw new Error(`Parse error: "${numberString}" is not a number.`)
	return number
}

function readBoolean(array: LiteralArray) {
	const booleanString = readUntil(array, ";")
	if (booleanString !== "0" && booleanString !== "1")
		throw new Error(
			`Parse error: "${booleanString}" is not a boolean number.`
		)
	const boolean = !!+booleanString
	return boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function readNull(array: LiteralArray) {
	return null
}

function readArray(array: LiteralArray) {
	const length = readNumber(array, ":")
	const resultArray = []
	// Shift out first bracket.
	readUntil(array, "{")
	for (let i = 0; i < length; i++) {
		const key = readValue(array)
		const value = readValue(array)
		resultArray[key] = value
	}
	readUntil(array, "}")
	return resultArray
}

function readName(array: LiteralArray) {
	readUntil(array, ":")
	readUntil(array, '"')
	const name = readUntil(array, '"')
	readUntil(array, ":")
	return name
}

function readObject(array: LiteralArray) {
	const resultObjectName = readName(array)
	const resultObject = {}
	const insideResultObject = (resultObject[resultObjectName] = {})
	const length = readNumber(array, ":")

	readUntil(array, "{")
	for (let i = 0; i < length; i++) {
		const key = readValue(array)
		const value = readValue(array)
		insideResultObject[key] = value
	}
	readUntil(array, "}")

	return resultObject
}

function readClass(array: LiteralArray) {
	const resultClassName = readName(array)
	const resultClass = {}
	const insideResultClass = (resultClass[resultClassName] = [])
	const length = readNumber(array, ":")

	readUntil(array, "{")
	for (let i = 0; i < length; i++) {
		const value = readValue(array)
		insideResultClass.push(value)
	}
	readUntil(array, "}")

	return resultClass
}

function readValue(array: LiteralArray) {
	const type = readUntil(array, ":;")
	switch (type.toLowerCase()) {
		case "s": // s:len<string>:"<string>";
			return readString(array)
		case "i": // i:<integer>;
		case "d": // d:<float>;
		case "r": // r:<integer>;
			return readNumber(array)
		case "a": // a:len<array>:{<key>;<val>.....}
			return readArray(array)
		case "o": // o:len<object_class_name>:<object_class_name>:len<object>:{<key>;<val>....}
			return readObject(array)
		case "c": // c:len<class_name>:"<class_name>":len<val>:{<val>}
			return readClass(array)
		case "b": // b:<digit>;  digit is either 1 or 0
			return readBoolean(array)
		case "n": // n; null
			return readNull(array)
		default:
			throw new Error(`Unknown type: "${type}" at offset ${array.offset}`)
	}
}

function read(array: LiteralArray) {
	const key = readUntil(array, "|")
	const value = readValue(array)
	const result = {}
	result[key] = value
	return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unserialize(text: string): any {
	const result = {}
	const array: LiteralArray = Array.from(text)
	array.offset = 0
	do {
		try {
			Object.assign(result, read(array))
		} catch (err) {
			err.message +=
				', Left text: "' + array.slice(array.offset).join("") + '"'
			throw err
		}
	} while (array.offset < array.length)
	return result
}
