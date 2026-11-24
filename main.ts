// One Letter for Your Day (Node 22, standard library only).
//
// The entry is exactly one letter, A to Z, standing for the word that
// describes the day. This program hands that letter to the house: it reads
// LETTER.txt from the repository root, checks it is a single capital letter,
// and writes exactly that one byte to /output/entry.txt, where the judge
// reads it. No newline, no gloss, nothing else: the gate allows 1 to 1
// characters, so even a trailing line break would fail it.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const source = join(BOT_DIR, "LETTER.txt");
const target = join(OUTPUT_DIR, "entry.txt");

if (!existsSync(source)) {
  throw new Error("LETTER.txt is missing from the repository root");
}
const raw = readFileSync(source, "utf8");
if (raw.length !== 1) {
  throw new Error(`entry must be exactly 1 character, got ${raw.length}`);
}
const letter = raw;
if (!/^[A-Z]$/.test(letter)) {
  throw new Error(`entry must be one capital letter A to Z, got ${JSON.stringify(letter)}`);
}
// No white space, no control byte, no punctuation: a single letter and
// nothing else is the whole entry.
if (/\s/.test(letter)) {
  throw new Error("entry must not be white space");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(target, letter);
// The file must hold exactly one byte: a trailing newline would make it
// two characters and fail the gate, so check the byte length too.
const stat = readFileSync(target);
if (stat.length !== 1) {
  throw new Error(`output must be exactly 1 byte, got ${stat.length}`);
}
const roundTrip = readFileSync(target, "utf8");
if (roundTrip !== letter) {
  throw new Error("round-trip check failed: output bytes differ from LETTER.txt");
}
console.log(`letter: ${letter}`);
