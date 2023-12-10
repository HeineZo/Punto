-- Active: 1699270247064@@127.0.0.1@3306

CREATE TABLE IF NOT EXISTS Game (
	id INT NOT NULL AUTO_INCREMENT,
    idWinner INT,
    nbPlayer INT DEFAULT 0,
    nbMove INT DEFAULT 0,
    nbRound INT DEFAULT 2,
    duration INT DEFAULT 0,
	createdAt INT(11),
    
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS Player (
	id INT NOT NULL AUTO_INCREMENT,
    pseudo VARCHAR(50),
    nbMove INT DEFAULT 0,
	nbVictory INT DEFAULT 0,
    createdAt INT(11),
    
    PRIMARY KEY(id)
);

ALTER TABLE Game DROP FOREIGN KEY fk_winner_id;
ALTER TABLE Game ADD CONSTRAINT fk_winner_id FOREIGN KEY (idWinner) REFERENCES Player(id);

CREATE TABLE IF NOT EXISTS GameParticipation (
	id INT NOT NULL AUTO_INCREMENT,
    idGame INT NOT NULL,
    idPlayer INT NOT NULL,
    nbMove INT DEFAULT 0,
    createdAt INT(11),
    
    PRIMARY KEY(id),
	FOREIGN KEY (idGame) REFERENCES Game(id),
    FOREIGN KEY (idPlayer) REFERENCES Player(id)
);

CREATE TABLE IF NOT EXISTS GameMove (
	id INT NOT NULL AUTO_INCREMENT,
    idParticipation INT NOT NULL,
    color VARCHAR(20) NOT NULL,
    value INT NOT NULL, 
    rowPosition INT NOT NULL,
    colPosition INT NOT NULL,
    createdAt INT(11),

	PRIMARY KEY(id),
    FOREIGN KEY (idParticipation) REFERENCES GameParticipation(id)
);