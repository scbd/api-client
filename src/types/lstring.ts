type Letter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'

type TwoLetterKey = `${Letter}${Letter}`
type ThreeLetterKey = `${Letter}${Letter}${Letter}`
type ValidKey = TwoLetterKey | ThreeLetterKey

type lstring = {
  [K in ValidKey]: string
}

export default lstring;