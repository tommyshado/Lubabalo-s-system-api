create table stock_inventory (
    shoe_id serial PRIMARY KEY,
    shoe_name text not null,
    image text not null,
    shoe_qty numeric not null,
    shoe_price numeric not null,
    shoe_color text not null,
    shoe_size numeric not null
)

create table user_signup (
    user_id serial PRIMARY KEY,
    name text not null,
    password text not null,
    email text unique not null
)