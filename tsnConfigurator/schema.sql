CREATE TABLE yang_models (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    jsonModel TEXT NOT NULL,
    pathToYangFile TEXT NOT NULL
);


CREATE TABLE configurations(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    configuration TEXT NOT NULL,
    inUsage BIT DEFAULT '0'
);

CREATE TABLE switches (
	id	INTEGER PRIMARY KEY AUTOINCREMENT,
	name	TEXT NOT NULL,
	uuid	TEXT NOT NULL UNIQUE,
	ip	TEXT NOT NULL,
	port	TEXT NOT NULL,
	username	TEXT NOT NULL,
	password	TEXT NOT NULL,
	devicetype	TEXT,
	producer	TEXT,
	serial	TEXT
);