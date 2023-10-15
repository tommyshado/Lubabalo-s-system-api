create table user_signup (
    user_id serial PRIMARY KEY,
    name text not null,
    password text not null,
    email text unique not null
)

create table shoes (
    shoe_id serial PRIMARY KEY,
    shoe_name text not null,
    price int
)

create table shoe_stock (
    shoe_id foreign key,
    qty int,
    color text,
    size int,
    image text not null
)

create table shopping_cart (

)