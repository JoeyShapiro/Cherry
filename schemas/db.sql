create table messages
(
    id      int auto_increment
        primary key,
    message varchar(512) not null,
    user_id int          not null,
    constraint id
        unique (id)
);

create table project.users
(
    id       int auto_increment
        primary key,
    username varchar(64)  not null,
    password varchar(128) not null,
    pfp      varchar(256) not null,
    session  varchar(36),
    constraint id
        unique (id)
);



-- bob:bob
INSERT INTO project.users (username, password, pfp)
VALUES ('bob',
        '0416a26ba554334286b1954918ecad7ba6c33575b49df915ff3367b5cef7ecd93b1f0b436636667b27b363011543971f1c81c3151d5ef72733501c1ff33c34af',
        'https://upload.wikimedia.org/wikipedia/en/c/c5/Bob_the_builder.jpg');

-- alice:alice
INSERT INTO project.users (username, password, pfp)
VALUES ('alice',
        '408b27d3097eea5a46bf2ab6433a7234a33d5e49957b13ec7acc2ca08e1a13c75272c90c8d3385d47ede5420a7a9623aad817d9f8a70bd100a0acea7400daa59',
        'https://upload.wikimedia.org/wikipedia/commons/6/63/Alice_par_John_Tenniel_04.png');

-- plug
INSERT INTO project.messages (message, user_id)
VALUES ('github.com/JoeyShapiro/Cherry', 1);
