/**
 * Synopsis fragments grouped into four "moods". Each film picks a mood from its
 * genres, draws one fragment per slot, then stitches them into sentences with
 * the skeletons below. That is why 1000+ entries read as distinct synopses
 * instead of shuffled boilerplate.
 *
 * Fragments are deliberately pronoun-free (leads carry no gender, so a synopsis
 * can never contradict itself) and all start lower-case — the renderer
 * capitalises whichever fragment lands at the start of a sentence.
 */

import { splitPool as split } from './pools.mjs'

export const MOOD_BY_GENRE = {
  Action: 'epic',
  Adventure: 'epic',
  Animation: 'light',
  Biography: 'epic',
  Comedy: 'light',
  Crime: 'dark',
  Documentary: 'mind',
  Drama: 'mind',
  Family: 'light',
  Fantasy: 'epic',
  History: 'epic',
  Horror: 'dark',
  Music: 'light',
  Mystery: 'dark',
  Romance: 'light',
  'Sci-Fi': 'mind',
  Thriller: 'dark',
  War: 'epic',
  Western: 'epic',
}

export const MOOD_SLOTS = [
  'incite',
  'lead',
  'goal',
  'place',
  'object',
  'past',
  'stakes',
  'turn',
  'close',
]

export const MOODS = {
  epic: {
    incite: split(
      'a border survey turns up a village that every official map insists is empty|word arrives that a mountain pass has reopened for the first time in thirty years|a regional archive loses its funding, and with it the last copy of the expedition records|an auction of recovered wartime material draws the wrong four people|a survey ship vanishes inside a strait the maps insist is shallow|a drought cracks the reservoir four towns have been arguing over|a mining crew breaks into a chamber nobody on the payroll admits exists|a convoy turns back with half its cargo and no explanation',
    ),
    lead: split(
      'a cartographer who has not left the drafting room in a decade|a disgraced field officer with a talent for remembering routes|a father who has been away for most of a daughter’s life|a surveyor who reads ground the way other people read faces|a historian who has lied about the family name|a welder who signed the structure twenty years ago|a park ranger with eleven months left before retirement|a translator who took the job for the money|a shepherd who has mapped the same hillside a thousand times',
    ),
    goal: split(
      'survey the pass before winter closes it|find the survey ledger before the archive is cleared|walk a road nobody has walked in thirty years|return a deed to the family still paying for it|prove the village was moved on the map on purpose|escort a set of plates to whoever is meant to read them|find the chamber the crew opened and sealed again|get four hundred people across the flats before the weather turns',
    ),
    place: split(
      'the terraced hills above Kalvara|the drowned village at low water|the pass where the road ends|the coastal flats at the edge of the fog|the high plateau before the first snow|the abandoned mill town|the ferry crossing that runs twice a week|the district that burned and was renamed|a valley with two names on two official maps',
    ),
    object: split(
      'a survey ledger nobody wants read aloud|a tin box of undeveloped plates|a coat with the maps stitched into the lining|a reel of tape recorded without anyone speaking|the original deed|the last working radio at the summit|a list of names in a language nobody can read|a compass that does not answer to north',
    ),
    past: split(
      'what happened the winter the road closed|a promise made in a hospital corridor|a debt that came due early|a name struck from every record|a night that three witnesses remember differently|why a brother stopped writing home|the last order ever given at the quarry',
    ),
    stakes: split(
      'the only water supply within two hundred kilometres|eleven families with nowhere else to go|the last legal claim to the coastline|an agreement that has held for fifty years|a hospital that will close within the year|the name of the village itself|the pass in winter',
    ),
    turn: split(
      'the measurements stop matching the photographs|a confidant turns out to have been paid twice|the document was signed by someone still alive|the route being followed was closed on purpose|the village has been moved on the map before|the rival expedition has already been buried',
    ),
    close: split(
      'the pass closes again, and this time the keys are kept|the map is redrawn without the surveyor’s name on it|everyone agrees to a story that keeps the water flowing|the road stays open and nobody walks it again|the record is corrected quietly, years later|the ledger goes home in a different coat',
    ),
  },

  dark: {
    incite: split(
      'a body is found in a reservoir with no fingerprints on it|a night-shift paramedic calls the same ambulance number twice in one week|a tenant in a building nobody can legally evict disappears|a cold-case unit reopens a file that was closed in nine minutes|a missing persons desk notices the same name on nine separate reports|a city hearing clinic starts receiving requests nobody can explain|a photograph surfaces showing a room that has stood empty for thirty years',
    ),
    lead: split(
      'a coroner who trusts paperwork over instinct|a detective three weeks from a transfer|a night nurse who keeps a private log|a bailiff known for collections rather than confessions|a student reporter with an excellent recorder|a locksmith who works nights and talks little|a stranger who came back to town for one winter|a clerk who has read every case file in the building',
    ),
    goal: split(
      'identify the body before the reservoir is drained|reopen a file that was shut in nine minutes|find the tenant who cannot be found on paper|get a statement signed by the only witness left|prove the recordings were cut by someone in the room|trace a key to whoever stamped the number into it|keep the archive open long enough to read what is inside|explain why the calls stopped',
    ),
    place: split(
      'the estate with the boarded upper floor|the reservoir road that closes at dusk|a block of flats with two unlisted units|the clinic on the fifth floor|a municipal archive due to be demolished|a warehouse district behind the ring road|the hospital annexe nobody is assigned to|a shuttered cinema that still takes deliveries',
    ),
    object: split(
      'a pager that belonged to someone else|a key with a number stamped into the bow|a second set of statements in different handwriting|a box of tapes labelled only with dates|a photograph nobody remembers being taken|a receipt with an impossible timestamp|a list of names with one line scratched out',
    ),
    past: split(
      'what happened in apartment 3B|why one name was on the witness list|the eleven minutes the file was closed|what the first coroner found and did not write down|a promise made to a man who is still alive|why the tape was never played',
    ),
    stakes: split(
      'the only person still willing to sign a statement|a child who has started drawing the same picture every day|the four people who know what is in the archive|the last witness|a family that cannot afford another lawyer|the caller who has rung every night for a month',
    ),
    turn: split(
      'the calls stop coming from the flat next door|the file that was supposed to stay closed is on the desk|every recording is missing the same four seconds|the witness describes a house that no longer exists|the arrest was made against the wrong person|the name on the list belongs to someone already buried',
    ),
    close: split(
      'the case is closed again, this time under a different name|nobody in the building admits to living there|the inquiry finds nothing and the reservoir stays quiet|the log is kept, and the log keeps the keeper|the file goes back in the drawer until someone else is ready',
    ),
  },

  mind: {
    incite: split(
      'an attempt to document an ordinary life turns into an argument it cannot finish|a translator notices the same three pages missing from every edition|a community keeps careful records of something that has no name|an engineer is asked to restore a voice nobody can place|the habits of a small town change in one season and only one family remarks on it|a photographer develops a frame containing everyone except the person who took it|a biographer misses a deadline and starts reading footnotes',
    ),
    lead: split(
      'a translator who has been wrong before|a biographer who promised a date|a sound engineer with an obsessive archive habit|a teacher who has kept every student’s drawing|a doctor who rereads the same journals every night|a cartographer who maps feelings instead of streets|a cook who feeds everyone and trusts no one|a printer who has cut letters for forty years',
    ),
    goal: split(
      'translate a text nobody will admit to owning|find the missing three pages before the reprint|record a voice that has been out of use for forty years|write a book that can be checked|reconstruct a house from plans that do not fit the ground|keep an original recording out of the wrong hands|finish a biography the subject has already refuted|map a village that is being moved inland',
    ),
    place: split(
      'a house on a road that no longer exists|the coastal hospital where the subject was born|a mountain observatory between seasons|a border town where two languages overlap|the family farmhouse|a research station with nine residents|a village that is slowly moving inland|a workshop above a print shop',
    ),
    object: split(
      'a reel of tape with someone breathing on it|a notebook kept by two people|a single photograph with three versions|a letter written in the wrong tense|a dictaphone kept for thirty years|plans for a building that was never built|a stack of postcards nobody has posted',
    ),
    past: split(
      'why the family left the valley|what the mother never finished|a conversation that ended in 1974|the name nobody uses any more|the winter the station closed|a debt owed in friendship rather than money|the reason the recordings were stopped',
    ),
    stakes: split(
      'the only version of the story that survives|a relationship that has lasted forty years|the last person alive who remembers|a village’s sense of itself|the right to tell a story one’s own way|the final page of a book nobody will finish',
    ),
    turn: split(
      'the recordings were edited by someone who was not there|the interviewer asks a question the subject remembers answering differently|the same story turns up in an archive four countries away|the subject has been telling a version all along|the house is not where the plans say it is|the last page is missing from every copy',
    ),
    close: split(
      'the book exists and it is not quite true|the house comes down and the recording stays|the archive agrees to correct the record in a footnote|nobody thanks anyone and the road stays open|the finished pages are read aloud to an empty hall|the original is kept and the copy circulates',
    ),
  },

  light: {
    incite: split(
      'a bakery is left to three siblings who agree on nothing|an all-girl brass band has one week to win a regional final|a retired magician is offered one last tour, at his own expense|a community choir inherits a hall with a leaking roof|a dance team from a closing school refuses to disband|a cook is judged in a competition by someone who cannot taste|a theatre company finds a script nobody has staged since the war',
    ),
    lead: split(
      'a baker with a disastrous temper|a retired magician who talks to the cards|a seventeen-year-old drummer who cannot read music|a widowed cook who feeds the whole street|a choreographer who has never been on stage|a librarian who runs the only open room in town|a groundskeeper who plays a very good trumpet|a printer who has always wanted to sing',
    ),
    goal: split(
      'win a regional final with one broken amplifier|bake a hundred loaves before the oven fails|reopen a hall before the roof comes down|get a touring company back on the road for one last run|teach the band the song they have been avoiding|fill a theatre that has not had a crowd in nine years|make a final the judges have to sit through|keep a community kitchen open past Christmas',
    ),
    place: split(
      'a hall with a leaking roof|the bakery on the corner of an empty street|a school that closes in June|a caravan park at the end of the season|a rehearsal room above a closed shop|a market that has lost half its stalls|a pier theatre that has not opened in nine years',
    ),
    object: split(
      'a box of sheet music nobody can read|the only working amplifier in town|a recipe book with half the pages missing|a ticket to a final that has already happened|a trumpet with a dented bell|a set of keys to a building that is being sold|a poster nobody has the ink to print',
    ),
    past: split(
      'why the band split up the last time|a promise somebody has kept for thirty years|the year the hall was nearly lost|what the father never came back from|how the choir survived the winter of the flood|why the bakery stopped baking bread',
    ),
    stakes: split(
      'the last hall in town|a weekend that three hundred people have planned|the bakery the grandmother built|a friendship that has survived four moves|the only stage big enough for them|the choir that has never sung a note together',
    ),
    turn: split(
      'the sheet music turns out to be in a different key|a rival lends them the one thing they lack|the audience starts singing before the band does|the judges have been listening to the wrong group|the building is sold anyway, on the last night|the weather takes the outdoor stage away',
    ),
    close: split(
      'the hall stays open for one more winter|they play a different final in a different town|the bakery gets a second oven|nobody wins and everybody comes back|a rehearsal ends with the lights still on|the last show sells out before the posters are up',
    ),
  },
}

/**
 * Sentence skeletons. Placeholders are slot names and the template itself owns
 * the punctuation; the renderer only handles capitalisation and makes sure a
 * slot is never spent twice in the same synopsis.
 */
export const SKELETONS = [
  '{incite}. {lead} takes on the job of trying to {goal}, and the first week in {place} changes the shape of it.',
  'When {incite}, {lead} is the only one still interested — and the question turns very simple: how to {goal}.',
  '{lead} arrives in {place} planning to {goal}; by the second week, {object} has made that impossible.',
  'It starts with a small fact: {incite}. From there the only way forward is to {goal}, with {stakes} riding on it.',
  '{incite} — and the paperwork behind it is worse. {lead} goes back to {place} to {goal}.',
  'Behind the question of {object} there is a larger one: {past}. Once the digging starts it cannot be packed up again.',
  'The first half is patient. {lead} settles into {place}, learns who keeps what, and starts to see why {stakes} matters.',
  '{lead} means to {goal}. {place} makes that expensive, and {object} makes it dangerous.',
  'There is a version of this story in which nothing happens at all. This is not it: {incite}, and {lead} is in the room.',
  'Halfway through, {turn} — and the careful plan to {goal} comes apart in an afternoon.',
  'Nobody in {place} wants {past} written down. {lead} writes it down anyway.',
  '{lead} has exactly one advantage: {object}. It is not enough of one, and it will cost more than expected.',
  'By the middle {lead} has stopped asking what happened and started asking who was there to see it.',
  'There is a version of the truth everyone can live with, and one that can be documented. {lead} tries the second one.',
  'What {place} does to a routine investigation is the quiet subject of the film, and {lead} is its worst witness.',
  'The plan is straightforward: {goal}. The plan assumes a great many things, starting with {object}.',
]

/** Closing clauses, appended as the final sentence of every synopsis. */
export const CLOSERS = [
  'In the end, {close}.',
  'By the last scene, {close}.',
  'What happens next is simple to state: {close}.',
  'The ending is not the point, though it is worth saying that {close}.',
  'None of it changes quickly, but {close}.',
  'And that is how it ends: {close}.',
]

/** One-line logline, shown on cards, in search results and on the detail page. */
export const TAGLINES = {
  epic: [
    'The map is honest. The people who drew it are not.',
    'A journey measured in seasons, not miles.',
    'Some borders hold long after everyone stops believing in them.',
    'They came for the survey. They stayed for the valley.',
    'An old promise, an old road, and one winter to cross it.',
    'The land remembers what the paperwork forgot.',
  ],
  dark: [
    'Everyone agrees on the story. Nobody agrees on the facts.',
    'The file was closed in nine minutes. It takes longer to open.',
    'Nothing here is missing. That is the problem.',
    'The private log was kept. That was the mistake.',
    'The town has one version of the night. The ledger has three.',
    'Somebody returned the key. Nobody returned the rest.',
  ],
  mind: [
    'A life measured in versions, and none of them final.',
    'Every copy of the story is missing the same page.',
    'Translator of other people’s lives — until this one.',
    'The record exists. The question is who wrote it.',
    'An archive, a house, and a name nobody says any more.',
    'The truth kept its own archive. Only the door was missing.',
  ],
  light: [
    'One hall, one week, and a band that has run out of reasons.',
    'The only thing they agreed on was the day.',
    'Three siblings, one oven, no written will.',
    'They were never going to win. They entered anyway.',
    'The town forgot how to sing. They reminded it.',
    'It was never about the prize. It was always about the room.',
  ],
}

export const KEYWORD_MOODS = {
  epic: 'frontier|legacy|expedition|monument|landscape|survival',
  dark: 'investigation|unravel|noir|disappearance|small-town|conspiracy',
  mind: 'memory|archive|portrait|essay|intimate|observation',
  light: 'ensemble|music|coming-of-age|community|warm|rehearsal',
}