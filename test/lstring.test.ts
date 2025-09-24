import type lstring from '../src/types/lstring';

const test : lstring = {
  en: "Hello",
  fr: "Bonjour",
  es: "Hola",
  de: "Hallo",
  it: "Ciao",
  pt: "Olá",
  ru: "Привет",
  zh: "你好",
  ja: "こんにちは",
  ko: "안녕하세요",
  ar: "مرحبا",
  hi: "नमस्ते",   
  pat: "Salut",
  eng: "Hello",
  fra: "Bonjour",
  spa: "Hola",
  deu: "Hallo",
  hfdjkhfkjd: "This should not be allowed", // @ts-expect-error
  e: "This should not be allowed", // @ts-expect-error
  english: "This should not be allowed", // @ts-expect-error  
}