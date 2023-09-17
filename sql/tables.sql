CREATE TABLE IF NOT EXISTS A_State (
    id SERIAL PRIMARY KEY,
    type_state TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Token_type (
    id SERIAL PRIMARY KEY,
    type_token TEXT NOT NULL,
    right_read BOOLEAN NOT NULL,
    right_write BOOLEAN NOT NULL,
    right_edit BOOLEAN NOT NULL,
    right_admin BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS U_Session (
    id SERIAL PRIMARY KEY,
    sessionToken TEXT NOT NULL,
    expires INTEGER,
    last_activity TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Shift (
    id SERIAL PRIMARY KEY,
    transport TEXT NOT NULL,
    shift_start TIMESTAMP NOT NULL,
    shift_end TIMESTAMP NOT NULL,
    s_route TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS S_Partner (
    id SERIAL PRIMARY KEY,
    p_name TEXT NOT NULL,
    email TEXT UNIQUE,
    hashed_password TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    partner_states INTEGER,
    FOREIGN KEY (partner_states) REFERENCES A_State(id)
);

CREATE TABLE IF NOT EXISTS U_Card (
    id SERIAL PRIMARY KEY,
    c_number TEXT NOT NULL,
    c_state INTEGER NOT NULL,
    time_start TIMESTAMP NOT NULL,
    time_end TIMESTAMP NOT NULL,
    CHECK (time_start < time_end),
    FOREIGN KEY (c_state) REFERENCES A_State(id)
);

CREATE TABLE IF NOT EXISTS Special_Card (
    id SERIAL PRIMARY KEY,
    c_number TEXT NOT NULL,
    c_state INTEGER NOT NULL,
    time_start TIMESTAMP NOT NULL,
    time_end TIMESTAMP NOT NULL,
    CHECK (time_start < time_end),
    FOREIGN KEY (c_state) REFERENCES A_State(id)
);

CREATE TABLE IF NOT EXISTS client (
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    middle_name TEXT,
    sex TEXT NOT NULL,
    email TEXT UNIQUE,
    born DATE NOT NULL,
    city TEXT NOT NULL, 
    session_id INTEGER NOT NULL,
    hashed_password TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type INTEGER,
    account_states INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    FOREIGN KEY (session_id) REFERENCES U_Session(id),
    FOREIGN KEY (token_type) REFERENCES Token_type(id),
    FOREIGN KEY (account_states) REFERENCES A_State(id),
    FOREIGN KEY (card_id) REFERENCES U_Card(id)
);

CREATE TABLE IF NOT EXISTS Benefit (
    id SERIAL PRIMARY KEY,
    b_name TEXT NOT NULL,
    b_value INTEGER NOT NULL,
    time_start TIMESTAMP NOT NULL,
    time_end TIMESTAMP NOT NULL,
    CHECK (time_start < time_end)
);

CREATE TABLE IF NOT EXISTS client_benefit (
    id_client INTEGER REFERENCES client (id),
    id_benefits INTEGER REFERENCES Benefit (id),
    PRIMARY KEY (id_client, id_benefits)
);

CREATE TABLE IF NOT EXISTS Discount (
    id SERIAL PRIMARY KEY,
    d_name TEXT NOT NULL,
    d_value INTEGER NOT NULL,
    partnerId INTEGER NOT NULL,
    time_start TIMESTAMP NOT NULL,
    time_end TIMESTAMP NOT NULL,
    FOREIGN KEY (partnerId) REFERENCES S_Partner(id),
    CHECK (time_start < time_end)
);

CREATE TABLE IF NOT EXISTS client_discount (
    id_client INTEGER REFERENCES client (id),
    id_discount INTEGER REFERENCES Discount (id),
    PRIMARY KEY (id_client, id_discount)
);

CREATE TABLE IF NOT EXISTS U_Transaction (
    id SERIAL PRIMARY KEY,
    clientId INTEGER,
    amount FLOAT8,
    birth TIMESTAMP NOT NULL,
    coord_x FLOAT8,
    coord_y FLOAT8,
    benefits BOOLEAN NOT NULL,
    CHECK (amount >= 0)
);

CREATE TABLE IF NOT EXISTS Stuff (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    middle_name TEXT NOT NULL,
    sex TEXT NOT NULL,
    email TEXT UNIQUE,
    city TEXT NOT NULL, 
    born DATE NOT NULL,
    session_id INTEGER NOT NULL,
    hashed_password TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type INTEGER NOT NULL,
    stuff_states INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    shift_id INTEGER NOT NULL,
    FOREIGN KEY (session_id) REFERENCES U_Session(id),
    FOREIGN KEY (token_type) REFERENCES Token_type(id),
    FOREIGN KEY (stuff_states) REFERENCES A_State(id),
    FOREIGN KEY (card_id) REFERENCES Special_Card(id),
    FOREIGN KEY (shift_id) REFERENCES Shift(id)
);