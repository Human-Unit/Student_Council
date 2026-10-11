# Future parser boundary

No university parser is implemented. The authoritative source, permission to
access it, update frequency, and parsing requirements must be defined first.

Future flow: external source -> parser -> normalized Pydantic data -> service ->
database. A parser should accept a source/configuration, return validated
normalized records, and report source/provenance and parse failures. Services own
deduplication, transactions, and persistence. Routers must never scrape websites.

Do not import HTTP routers into parsers, write to PostgreSQL from a parser, or
schedule scraping as part of API startup. Fixtures must avoid private student data.
