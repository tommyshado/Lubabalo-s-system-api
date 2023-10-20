create table user_signup (
    user_id serial PRIMARY KEY,
    name text not null,
    password text not null,
    email text unique not null
)

create table shoes (
    shoe_id serial PRIMARY KEY,
    shoe_name text not null,
    image text not null,
    description text not null,
    price int
)

create table shoes_stock (
    qty int,
    color text,
    size int,
    shoe_id int,
    foreign key (shoe_id) references shoes(shoe_id) on delete cascade
);

CREATE TABLE shopping_cart (
    cart_id serial PRIMARY KEY,
    user_id int REFERENCES user_signup(user_id) ON DELETE CASCADE,
    shoe_id serial REFERENCES shoes(shoe_id) ON DELETE CASCADE,
    qty numeric not null
);
