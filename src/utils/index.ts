export function capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function capitalizeFirstLetterAllWords(string:string) {
	return string.split(' ').map(capitalizeFirstLetter).join(' ')
}

export function getKeyByValue<T>(object:{[key:string]:T}, value:T) {
  return Object.keys(object).find(key => object[key] === value)
}