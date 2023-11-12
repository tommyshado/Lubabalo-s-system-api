create table stock_inventory (
    shoe_id serial PRIMARY KEY,
    shoe_name text not null,
    description text not null,
    image text not null,
    catagory text not null,
    shoe_qty numeric not null,
    shoe_price numeric not null,
    shoe_color text not null,
    shoe_size numeric not null
)

create table user_signup (
    user_id serial PRIMARY KEY,
    name text unique not null,
    password text,
    email unique text
)

create table shopping_cart (
    cart_id serial PRIMARY KEY,
    quantity int not null,
    username text,
    foreign key (username) references user_signup(name) on delete cascade,
    shoe_id text,
    foreign key (shoe_id) references stock_inventory(shoe_id) on delete cascade,
)