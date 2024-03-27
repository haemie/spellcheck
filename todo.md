<h1>TODO:</h1>

- make case insensitive

- handle words with accents like garçonniere

- look into pronounciation helpers:
  https://www.npmjs.com/package/compromise
  https://observablehq.com/@spencermountain/compromise-pronounce
  words like khor

- look into other dictionary apis:
  https://developer.wordnik.com/

- check word from dictionary matches query:
  lustration => lustrate,
  russel => Crouse?

- use own database?

- remove answer word from client state entirely?

- Using github pages for the frontend makes cookies from the backend come in as third party cookies, which are unsupported by many browsers. Would be fixed by using custom domain, or implementing sessions using JWT to remove reliance on third party cookies https://stackoverflow.com/questions/59384430/cookies-only-set-in-chrome-not-set-in-safari-mobile-chrome-or-mobile-safari.
